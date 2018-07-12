const fs=require('fs');
const https=require('https');
const {spawn}=require('child_process');
const server=spawn('java',['-jar','server.jar']);
server.stdout.on('data',d=>console.log(d));
server.stderr.on('data',d=>console.error(d));
server.on('close',c=>console.log("Process closed with code "+c));
https.get('https://yivesmirror.com/api/file/spigot/spigot-latest.jar',res=>{
  let data='';
  res.on('data',d=>data+=d.toString());
  res.on('end',()=>{
    if(fs.readFileSync('serverInfo.txt','utf8')==data)return console.log('Server is already up-to-date!');
    fs.writeFileSync('serverInfo.txt',data);
    https.get('https://yivesmirror.com/files/spigot/spigot-latest.jar',updata=>updata.pipe(fs.createWriteStream('server.jar')));
  });
}).on('error',e=>console.error(e));
