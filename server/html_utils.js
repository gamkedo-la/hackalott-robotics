
const fs = require('fs');
const path = require('path');

const root_dir = path.join(__dirname, ".."); // WARNING: CHANGE THIS IF WE MOVE THIS SOURCE FILE AROUND

// Replace all "{{value_name}}" in the html text by `template_values["value_name"]` - in case it's a template
const process_html_template = (html_content, template_values) => {
  let processed_content = html_content;    // We don't want to change the original.
  for (const [key, value] of Object.entries(template_values)) {
    processed_content = processed_content.replace(`{{${key}}}`, value);
  };
  return processed_content;
};

const serve_file_not_found = (path, response) =>{
  // TODO: replace this by an html file.
  response.statusCode = 404;
  response.setHeader('Content-Type', 'text/plain');
  response.end(`Wrong URL : ${path}`);
};

// Serve an processed html (template) file path relative to this file's directory.
// file_path: a path to the html file to process, relative to the root directory
// response: a http.Response object to send the processed html.
// template_values: name => values to be replaced in the html files (see process_html_template).
const serve_html = async (file_path, response, template_values = {} ) => {
    let local_path = path.join(root_dir, file_path); // TODO: search from the root directory of the project instead?
    
    // console.log(`__dirname == ${__dirname}`);
    // console.log(`root_dir == ${root_dir}`);

    if(!fs.existsSync(local_path)){
      console.log(`Requested file not found: ${local_path}`);
      serve_file_not_found(file_path, response);
      return;
    }

    console.log(`Serving ${local_path}`);
    var contents;
    try{
      contents = await fs.promises.readFile(local_path, { encoding: 'utf8'});
    }
    catch(error){
      response.end(`SERVER ERROR: ${error}`);
      return;
    }
      
    // console.log(`Processing ${local_path} ...`);
    let processed_content = process_html_template(contents, template_values);
  
    // console.log(`Sending processed ${local_path} ...`);
    if(local_path.endsWith(".html")) {
      response.writeHead(200, {'Content-Type': 'text/html'});
    }
    else if(local_path.endsWith(".js")){
      response.writeHead(200, {'Content-Type': 'text/javascript'});
    }
    else 
    { // At least we found the file...
      response.writeHead(200); 
    }

    response.end(processed_content);
    console.log(`Sending processed ${local_path} - Done`);  
  };
  

module.exports.process_html_template = process_html_template;
module.exports.serve = serve_html;
module.exports.serve_file_not_found = serve_file_not_found;
