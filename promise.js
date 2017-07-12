// promise resolve
let promise = new Promise(resolve=>{
  console.log("xx")
  resolve("tt")
})

Promise.resolve(promise).then(param=>{
  console.log(param)
})

// promise all
function func0(){
  return new Promise(resolve=>{
    console.log("ii")
    resolve("ii")
  })
}

function* func1(){
  return yield func0()
}

async function func2(){
  var content = await func0()
  return content
}

Promise.all([promise, func0(), func1().next().value, func2()]).then(params=>{
  console.log(params)
})
