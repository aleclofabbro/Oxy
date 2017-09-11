import React from 'react';
import R from 'ramda';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import User from '../src/comp/data/user';
const log = tag => (...args) => console.log.apply(null,[tag].concat(args))
const act = tag => (...args) => action(tag)(args)
const lensProp = notify => trg => (name, get, set) => _val => {
  const val = _val && _val.target && _val.target.value ? _val.target.value : _val
  if(val === void(0)){
    return (get||R.identity)(R.prop(name, trg))
  }else {
    notify(R.assoc(name, (set||get||R.identity)(val), trg), name, R.prop(name, trg), '=>', val)
  }
}

const user = {
    name:'alec',
    points:13,
    dob: String(new Date('1975-12-31')),
    addr:{
        street:'Grimm srt',
        number:'34'
    }
  }



const stories = storiesOf('User', module)
  .add('1', () => User({
    name:lensProp(act('name'))(user)('name', String),
    points:lensProp(act('points'))(user)('points', Number),
    dob:lensProp(act('dob'))(user)('dob', String),
  }))
