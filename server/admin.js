
import util from 'util';
import fs from 'fs';
import child_process from 'child_process';

const exec = util.promisify(child_process.exec);
const spawn = child_process.spawn;

const source_dir = process.cwd(); // We assume that node's working directory is the source code directory
const update_commands_context = { cwd : source_dir };

async function update_sources_to_master() {
  console.log("Updating sources to last version of current branch...");
  try{
    let {stdout, stderr} = await exec("git pull -r", update_commands_context);    
    console.log(stdout);
    return; // If everything is fine, just stop there.
  }
  catch(error){
    console.error("Source code update failed! -> " + error);
  }

  console.log("Attempting to abort source update...");
  try{    
    let {stdout, stderr} = await exec("git rebase --abort", update_commands_context);
    console.log(stdout);
  }
  catch(error){
    console.error("Abort failed! -> " + error);
  }
};

async function update_dependencies(on_done) {
  let {stdout, stderr} = await exec("npm ci", update_commands_context);
  console.log(stdout);  
};

function restart() {
  console.log("Restarting...");

  const logfile = `gameserver-${new Date().toISOString().replace(/:|T|\.|z/gi,"")}.log`;
  const out = fs.openSync(logfile, 'a');
  const err = fs.openSync(logfile, 'a');
  console.log("Next instance will log to " + logfile);
  const args = process.argv.splice(1);
  args.unshift("--experimental-modules"); // Apparently even if you already set it initially, it's not part of the args.
  console.log("Next instance args : " + args);
  spawn(process.execPath, args, {
    detached: true,
    stdio: ['ignore', out, err]
  }).unref();
  process.exit();
};

function stop() {
  console.log("Stopping...");
  process.exit();
};

async function update_and_restart() {
  return await update_sources_to_master()
    .then(update_dependencies)
    .then(restart);
};

export default { stop, restart, update_and_restart };
