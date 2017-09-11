const SYM = {
  oxy: Symbol('oxy'),
  value: Symbol('value'),
  stream: Symbol('stream'),
}

//https://github.com/ramda/ramda/issues/1332#issuecomment-130517662
const default_lens = path => R.lens(R.path(path), R.assocPath(path))

const oxy = (init_root_value, root_obs) => {

  const root_stream = new Rx.Subject()
  const init_value = init_root_value
  let current_root_value = init_root_value
  let invalidated =false

  const make_oxy = (oxy_path, lens) => {
    lens = lens || default_lens(oxy_path)

    let _my_stream;
    const stream = () => {
      if(!oxy_path.length){
        return root_stream
      }else{
        _my_stream = _my_stream || root_stream
          .filter(ev => ev.path.join('//').startsWith(oxy_path.join('//')))
        return _my_stream
      }
    }

    const get_value = () => R.view(lens, invalidated ? init_root_value : current_root_value)

    const _oxy = new Proxy(get_value(), {
      get: function(target, prop_name, receiver) {
        if(SYM.value === prop_name){
          return get_value()
        }
        if(SYM.stream === prop_name){
          return stream()
        }
        if(invalidated){
          return R.prop(prop_name, get_value())
        }
        const prop = R.prop(prop_name, get_value())
        if(prop && 'object' === typeof prop){
          const _prop_oxy = /* prop[SYM.oxy] = prop[SYM.oxy] || */ make_oxy(oxy_path.concat(prop_name))
          return  _prop_oxy
        }else{
          return prop
        }
      },
      set: function(target, prop_name, value, receiver) {
        if([SYM.stream,SYM.oxy,SYM.value].includes(prop_name)){
          get_value()[prop_name] = value
          return
        }
        const next_val = R.assoc(prop_name, value, get_value())
        root_stream.next({
          type: 'set',
          path: oxy_path,
          value: next_val
        })
      },
      ownKeys: function(target){
        return Object.getOwnPropertyNames(get_value())
      },
      getOwnPropertyDescriptor: function(target, prop) {
        return Object.getOwnPropertyDescriptor(get_value(), prop)

      }

    })
    _oxy[SYM.stream] = stream
    _oxy[SYM.value] = get_value
    return _oxy
  }
  const root_oxy = make_oxy([])
  const upd_subscr = root_stream
    .do(ev=>console.log('root:set:',ev, current_root_value))
    .do(ev=>current_root_value = R.assocPath(ev.path, ev.value, current_root_value))
    .subscribe()

  root_stream
    .auditTime(0)
    .do(ev=>console.log('root:update:'))
    .subscribe(ev => {
      console.log('invalidated:', current_root_value)
      invalidated = true
      oxy(current_root_value, root_obs)
      root_stream.complete()
    })
  root_obs(root_oxy)
}

Object.keys(SYM).forEach(key => Object.assign(oxy,{
  [SYM[key]]: (_oxy) => _oxy[SYM[key]]()
}))
