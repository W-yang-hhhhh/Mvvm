






export function generateCode(env){
    let code = "";
    for(let temp in env){
        code += "let " +temp+"=" +JSON.stringify(env[temp]) + ";";
    }
    return code;

}