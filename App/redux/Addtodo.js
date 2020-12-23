import React, {Component} from 'react';
import {connect} from 'react-redux';
import {addTodo} from '../redux/actions';
import {View} from 'react-native';

class AddTodo extends Component {
  constructor(props) {
    super(props);

    // this.handleAddTodo = this.handleAddTodo.bind(this);
  }
  componentDidMount() {
    this.props.onAddtodo(this);
  }

  componentWillUnmount() {
    this.props.onAddtodo(undefined);
  }

  async handleAddTodo(message) {
    // console.log('handleAddTodo', message);
    // var msg = JSON.parse(message)
    await this.props.addTodo(message);
    console.log('AddTodo handleAddTodo 1', message.speech);
    console.log('AddTodo handleAddTodo 1', message);
  }
  render() {
    return <View />;
  }
}

export const send = value => {
  console.log('AddTodo tess', value);
};

// export default AddTodo;

export default connect(
  null,
  {addTodo},
)(AddTodo);
