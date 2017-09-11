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

let usr, a =0

oxy(usr_data, next_oxy => {
  a++
  console.log('*',next_oxy)
  usr = next_oxy
})


const d = usr
log("+")
console.profile("a")
console.time("a")
for (let i=0; i<1000000; i++){
  usr.x = i
}
console.timeEnd("a")
console.profileEnd("a")
log("-")
/*
console.log('1',usr.addr.via)

usr.addr.via += "1"

console.log('2',usr.addr.via, d.addr.via)


usr.addr.via += "2"
console.log('3',usr.addr.via, d.addr.via)
*/
