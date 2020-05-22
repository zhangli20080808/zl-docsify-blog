# 高阶组件

高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。  
具体而言，高阶组件 就是一个工厂函数 参数为组件，返回值为新组件的函数。

高阶组件的作用是用于代码复用，可以把组件之间可复用的代码、逻辑抽离到高阶组件当中。新的组件和传入的组件通过 props 传递信息。
为了提高复用率，可测试性，就要保证组件功能的单一性 弱要满足复杂需求就要拓展单一的组件

```
import React from "react";

// 1.创建上下文
const Context = React.createContext();

// 2.获取Provider和Consumer
const Provider = Context.Provider;
const Consumer = Context.Consumer;

// withConsumer高阶组件，它根据配置返回一个高阶组件
function withConsumer(Consumer) {
  // Consumer 接受一个函数
  return Comp => props => {
    return <Consumer>{value => <Comp {...value} />}</Consumer>;
  };
}

//  我希望在 挂载的时候输出一些日志
const withLog = (Comp) => {
  return class extends React.Component {
    componentDidMount() {
      console.log('did mounted');
    }
    render() {
      return <Comp {...this.props}></Comp>;
    }
  };
};

// 经过withConsumer(Consumer)返回的高阶组件包装，Child获得了上下文中的值
const Child = withLog(
  withConsumer(Consumer)(function (props) {
    return <div onClick={() => props.add()}>{props.counter}</div>;
  })
);

export default class ContextTest extends React.Component {
  state = {
    counter: 0
  };

  add = () => {
    this.setState({ counter: this.state.counter + 1 });
  };

  render() {
    return (
      <Provider value={{ counter: this.state.counter, add: this.add }}>
        <Child />
        <Child />
        <Child />
      </Provider>
    );
  }
}

```

- [高阶组件](http://huziketang.mangojuice.top/books/react/lesson28)
- [React 高级组件精讲](https://github.com/qq449245884/xiaozhi/issues/44)
