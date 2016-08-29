
# react-hoodie

React Hoodie bindings. Inspired by [react-redux][] and [re-base][].

It's similar to [Redux][] in that:

* there is one true store
* writes are dispatched as tasks

And similar to [re-base][] in that:

* you explicitly bind data to component state

Plus, thanks to [Hoodie][]:

* it works offline (properly, i.e.: writes and first load)
* it syncs in realtime across multiple clients

[react-redux]: http://redux.js.org/docs/basics/UsageWithReact.html
[re-base]: https://github.com/tylermcginnis/re-base
[Redux]: http://redux.js.org/docs/introduction/ThreePrinciples.html
[Hoodie]: http://docs.hood.ie/

## Usage

Wrap your app in a hoodie:

```javascript
import React from 'react'
import ReactDOM from 'react-dom'

import { Hoodie, Provider } from 'react-hoodie'
import App from './app'

var hoodie = new Hoodie({url: 'http://localhost:8080'})
// hoodie.account.signIn({...}) etc.

ReactDOM.render(
  <Provider hoodie={hoodie}>
    <App />
  </Provider>,
  document.getElementById('root')
);
```

Bind hoodie data to component state and write to the hoodie store:

```javascript
import React, { Component } from 'react';

class App extends Component {
  constructor (props, context) {
    super(props, context)
    this.hoodie = context.hoodie;
    this.state = {
      'todos': []
    };
  }
  componentWillMount () {
    this.todos = this.hoodie.bindAll(this, 'todo', 'todos');
  }
  componentWillUnmount () {
    this.todos.unbind();
  }
  addTodo () {
    this.todos.add({'title': 'baba'});
  }
  render () {
    var todo = function (item) {
      return <li key={item.id}>{item.title}</li>;
    };
    return (
      <div className="App">
        <h2>Welcome to React Hoodie!</h2>
        <ul>{this.state.todos.map(todo)}</ul>
        <button onClick={this.addTodo.bind(this)}>
          + Add todo</button>
      </div>
    );
  }
}

App.contextTypes = {
  hoodie: React.PropTypes.any
}
```
