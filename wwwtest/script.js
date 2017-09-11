log=console.log
console.log=()=>{}
const usr_data = {
  name:'alec',
  addr:{
    via:'www-',
    n:1,
    a:['a','b'],
    o:{}
  },
  obj:{
    
  }
}

let usr

oxy(usr_data, next_oxy => {
    console.log('*',next_oxy)
    usr = next_oxy
  })


const d = usr
log("+")
for (let i=0; i<10000; i++){
  usr.addr.x = i
}
log("-")
/*
console.log('1',usr.addr.via)

usr.addr.via += "1"

console.log('2',usr.addr.via, d.addr.via)


usr.addr.via += "2"
console.log('3',usr.addr.via, d.addr.via)
*/