
const fs = require('fs');
const path = require('path');

// Replace all "{{value_name}}" in the html text by `template_values["value_name"]` - in case it's a template
const process_html_template = (html_content, template_values) => {
  let processed_content = html_content;    // We don't want to change the original.
  for (const [key, value] of Object.entries(template_values)) {
    processed_content = processed_content.replace(`{{${key}}}`, value);
  };
  return processed_content;
};


// Serve an processed html (template) file path relative to this file's directory.
// file_path: a path to the html file to process, relative to the current directory
// response: a http.Response object to send the processed html.
// template_values: name => values to be replaced in the html files (see process_html_template).
const serve_html = async (file_path, response, template_values = {} ) => {
    let html_path = path.join(__dirname, file_path); // TODO: search from the root directory of the project instead?
    console.log(`Serving ${html_path}`);
    var contents;
    try{
      contents = await fs.promises.readFile(html_path, { encoding: 'utf8'});
    }
    catch(error){
      response.end(`SERVER ERROR: ${error}`);
      return;
    }
      
    // console.log(`Processing ${html_path} ...`);
    let processed_content = process_html_template(contents, template_values);
  
    // console.log(`Sending processed ${html_path} ...`);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(processed_content);
    console.log(`Sending processed ${html_path} - Done`);  
  };
  

module.exports.process_html_template = process_html_template;
module.exports.serve = serve_html;
