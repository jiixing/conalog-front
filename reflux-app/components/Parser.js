import React from "react"
import refluxConnect from 'reflux-connect'
import AppActions from '../actions/AppActions'
import AppStore from '../stores/AppStore'
import _ from 'lodash'

let Table = require('antd/lib/table')
let Input = require('antd/lib/input')
let Button = require('antd/lib/button')
let Modal = require('antd/lib/modal')
let Form = require('antd/lib/form')
let Select = require('antd/lib/select')
let Popover= require('antd/lib/popover')
let Icon = require('antd/lib/icon')

const confirm = Modal.confirm;
const createForm = Form.create;
const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;

class Parser extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    AppActions.listParser();
  }

  componentWillUnmount() {
    if (_.isFunction(this.unsubscribe))
      this.unsubscribe();
  }

  onItemAdd() {
    AppActions.clearCurrentParser()
    AppActions.setParserAddModalVisible(true)
  }

  onAddOk() {
    AppActions.saveCurrentParser.triggerAsync()
      .then(() => {
        AppActions.clearCurrentParser()
        return AppActions.listParser()
      })
      .catch(err => {
        console.log(err)
      })
    AppActions.setParserAddModalVisible(false)
  }

  onAddCancel() {
    AppActions.clearCurrentParser()
    AppActions.setParserAddModalVisible(false)
  }

  onItemEdit(e) {
    let name = e.target.dataset.name
    AppActions.setParserEditModalVisible(true)
    AppActions.getParser(name)
  }

  onEditOk() {
    AppActions.saveCurrentParser.triggerAsync()
      .then(() => {
        AppActions.clearCurrentParser()
        return AppActions.listParser()
      })
      .catch(err => {
        console.log(err)
      })
    AppActions.setParserEditModalVisible(false)
  }

  onEditCancel() {
    AppActions.clearCurrentParser()
    AppActions.setParserEditModalVisible(false)
  }

  onItemDelete(e) {
    let name = e.target.dataset.name
    let id = e.target.dataset.id
    confirm({
      title: 'Confirm Delete',
      content: 'Are you sure to delete ' +  name  +' ('+  id  + ' ) ?',
      onOk: this.onDeleteOk,
      onCancel: this.onDeleteCancel
    })
    AppActions.getParser(name)
  }

  onDeleteOk() {
    AppActions.deleteCurrentParser.triggerAsync()
      .then(() => {
        AppActions.clearCurrentParser()
        return AppActions.listParser()
      })
      .catch(err => {
        console.log(err)
      })
  }

  onDeleteCancel() {
    AppActions.clearCurrentParser()
  }


  render() {

    let antdTableColumns = [
      {
        title: "ID",
        dataIndex: 'id',
        sorter: (a, b) => {
          var sa = a.id.split('').reduce((s, v) => s += v.charCodeAt(), 0)
          var sb = b.id.split('').reduce((s, v) => s += v.charCodeAt(), 0)
          if (sa === sb) {
            return a.id - b.id
          }
          return sa - sb
        }
      },
      {
        title: 'Name',
        dataIndex: 'name',
        sorter: (a, b) => {
          var sa = a.name.split('').reduce((s, v) => s += v.charCodeAt(), 0)
          var sb = b.name.split('').reduce((s, v) => s += v.charCodeAt(), 0)
          if (sa === sb) {
            return a.name - b.name
          }
          return sa - sb
        }
      },
      {
        title: 'Date',
        sorter: (a, b) => a.ts - b.ts,
        dataIndex: 'ts',
        render: (ts) => {
          let d = new Date(parseInt(ts)).toLocaleString()
          return d
        }
      },
      {
        title: 'Path',
        dataIndex: 'path',
        sorter: (a, b) => {
          var sa = a.path.split('').reduce((s, v) => s += v.charCodeAt(), 0)
          var sb = b.path.split('').reduce((s, v) => s += v.charCodeAt(), 0)
          if (sa === sb) {
            return a.path - b.path
          }
          return sa - sb
        }
      },
      {
        title: 'Parameter',
        dataIndex: 'parameter'
      },
      {
        title: 'InputType',
        dataIndex: 'input.type'
      },
      {
        title: 'InputChannel',
        dataIndex: 'input.channel'
      },
      {
        title: 'OutputType',
        dataIndex: 'output.type'
      },
      {
        title: 'OutputChannel',
        dataIndex: 'output.channel'
      },
      {
        title: 'Remark',
        render: (text, record) => (
          <Popover overlay = {record.remark} title = "Remark">
            <Icon type = "eye"></Icon>
          </Popover>
        )
      },
      {
        title: 'Operation',
        render: (text, record) => (
          <span>
            <a href="#" onClick={this.onItemEdit.bind(this)} data-name={record.name} >Edit</a>
            <span className="ant-divider"></span>
            <a href="#" onClick={this.onItemDelete.bind(this)} data-name={record.name} data-id={record.id} >Delete</a>
          </span>
        )
      }
    ]

    let antdTable = <Table rowKey = {line => line.id}
      columns = {antdTableColumns}
      dataSource = {this.props.appStore.parserList}
      loading = {this.props.appStore.parserLoadingFlag}
    />

    const { getFieldProps } = this.props.form

    const formItemLayout = {
      labelCol: {span: 6},
      wrapperCol: {span: 18}
    }


// add parser
    let antdFormAdd = <Form horizonal form = {this.props.form}>

      <FormItem {...formItemLayout} label = "Name">
        <Input {...getFieldProps('name', {})} type = "text" autoComplete = "off" />
      </FormItem>

      <FormItem {...formItemLayout} label = "Path">
        <Input {...getFieldProps('path', {})} type = "text" autoComplete = "off" />
      </FormItem>

      <FormItem {...formItemLayout} label = "Parameter">
        <Input {...getFieldProps('parameter', {})} type = "text" autoComplete = "off" />
      </FormItem>

      <FormItem {...formItemLayout} label = "Remark">
        <Input {...getFieldProps('remark', {})} type = "text" autoComplete = "off" />
      </FormItem>

      <FormItem {...formItemLayout} label = "InputType">
        <Select {...getFieldProps('inputType', {})}>
          <Option value = "RedisChannel" > RedisChannel </Option>
          <Option value = "NanomsgQueue" > NanomsgQueue </Option>
        </Select>
      </FormItem>

      <FormItem {...formItemLayout} label = "InputChannel">
        <Input {...getFieldProps('inputChannel', {})} type = "text" autoComplete = "off" />
      </FormItem>

      <FormItem {...formItemLayout} label = "OutputType">
        <Select {...getFieldProps('outputType', {})} >
          <Option value = "RedisChannel" > RedisChannel </Option>
          <Option value = "NanomsgQueue" > NanomsgQueue </Option>
        </Select>
      </FormItem>

      <FormItem {...formItemLayout} label = "OutputChannel">
        <Input {...getFieldProps('outputChannel', {})} type = "text" autoComplete = "off" />
      </FormItem>

    </Form>


//edit parser
    let antdFormEdit = <Form horizonal form = {this.props.form}>

      <FormItem {...formItemLayout} label = "ID">
        <span {...getFieldProps('id', {})}>{this.props.appStore.parser.id}</span>
      </FormItem>

      <FormItem {...formItemLayout} label = "Name">
        <span {...getFieldProps('name', {})}>{this.props.appStore.parser.name}</span>
      </FormItem>

      <FormItem {...formItemLayout} label = "Path">
        <Input {...getFieldProps('path', {})} type = "text" autoComplete = "off" />
      </FormItem>

      <FormItem {...formItemLayout} label = "Parameter">
        <Input {...getFieldProps('parameter', {})} type = "text" autoComplete = "off" />
      </FormItem>

      <FormItem {...formItemLayout} label = "Remark">
        <Input {...getFieldProps('remark', {})} type = "text" autoComplete = "off" />
      </FormItem>

      <FormItem {...formItemLayout} label = "InputType">
        <Select {...getFieldProps('inputType', {})} >
          <Option value = "RedisChannel"> RedisChannel </Option>
          <Option value = "NanomsgQueue"> NanomsgQueue </Option>
        </Select>
      </FormItem>

      <FormItem {...formItemLayout} label = "InputChannel">
        <Input {...getFieldProps('inputChannel', {})} type = "text" autoComplete = "off" />
      </FormItem>

      <FormItem {...formItemLayout} label = "OutputType">
        <Select {...getFieldProps('outputType', {})}>
          <Option value = "RedisChannel" > RedisChannel </Option>
          <Option value = "NanomsgQueue" > NanomsgQueue </Option>
        </Select>
      </FormItem>

      <FormItem {...formItemLayout} label = "OutputChannel">
        <Input {...getFieldProps('outputChannel', {})} type = "text" autoComplete = "off" />
      </FormItem>

    </Form>

//search button and input
    {/*const buttonClass = classNames({*/}
//       'ant-search-btn': true,
//       // 'ant-search-btn-noempty': !!this.state.historyEventIdFilter.trim()
//     })
//     const searchClass = classNames({
//       'ant-search-input': true,
//       // 'ant-search-input-focus': this.state.historyEventIdFilterFocus
//     })

    return (
      <div className = "container">
        <Modal
          title = "Add Parser"
          visible = {this.props.appStore.parserAddModalVisible}
          onOk = {this.onAddOk}
          onCancel = {this.onAddCancel}
        >
          {antdFormAdd}
        </Modal>

        <Modal
          title = "Edit Parser"
          visible = {this.props.appStore.parserEditModalVisible}
          onOk = {this.onEditOk}
          onCancel = {this.onEditCancel}
        >
          {antdFormEdit}
        </Modal>

        <div className = "row clbody">
          <div className = "ant-col-sm24 p-t-10">
            <Button type = "primary" icon = "plus-circle-o" onClick = {this.onItemAdd}/>
          </div>
        </div>

        <div className = "row clbody">
          {/*search */}
          {/*<div className="ant-col-sm-4 p-t-10 p-b-10 pull-right">*/}
          {/*<div className="ant-search-input-wrapper">*/}
          {/*<InputGroup className={searchClass}>*/}
          {/*<Input placeholder="" data-name="" /*defaultValue={}/>*/}
          {/*<div className="ant-input-group-wrap">*/}
          {/*<Button icon="search" data-name="" className={buttonClass}  />*/}
          {/*</div>*/}
          {/*</InputGroup>*/}
          {/*</div>*/}
          {/*</div>*/}

          <div className = "ant-col-sm-24 p-t-10">
            { antdTable }
          </div>
        </div>

      </div>
    )
  }
}


Parser.propTypes = {
  appStore: React.PropTypes.object
}

Parser.defaultProps = {

}

// 1. in createForm, bind appStore prop to form bi-directionally
Parser = createForm({
  onFieldsChange: (props, fields) => {
    // actually we don't care about props in reflux, just call AppActions to update state
    console.log('onFieldsChange', props, fields)

    let stateObj = {}
    for (let field in fields) {
      stateObj[fields[field].name] = fields[field].value
    }


//name of parser can not be the same !
    var existSameName = true
    if (fields.hasOwnProperty('name')) {
      existSameName = props.appStore.parserList.every (parser => {
        return parser.name !== fields['name'].value
      })
    }
    if (!existSameName) {
      stateObj[fields['name'].name] = ''
      alert('The name is existed, please change another name!')
    }


    AppActions.updateCurrentParser(stateObj)
  },
  mapPropsToFields: (props) => {
    console.log('mapPropsToFields', props)
    // if (props.appStore.parser == {})
    //   return { }

    return {
      id: {name: 'id', value: props.appStore.parser.id},
      name: {name: 'name', value: props.appStore.parser.name},
      path: {name: 'path', value: props.appStore.parser.path},
      inputType: {name: 'inputType', value: props.appStore.parser.inputType},
      inputChannel: {name: 'inputChannel', value: props.appStore.parser.inputChannel},
      outputType: {name: 'outputType', value: props.appStore.parser.outputType},
      outputChannel: {name: 'outputChannel', value: props.appStore.parser.outputChannel},
      parameter: {name: 'parameter', value: props.appStore.parser.parameter},
      remark: {name: 'remark', value: props.appStore.parser.remark}
    }
  }
})(Parser)

// 2. connect Parser with AppStore, so Parser has a prop named appStore
const ParserConnect = refluxConnect({
  appStore: AppStore
})(state => {

  return {
    appStore: state.appStore
  }
}, null, null, {pure: false})
Parser = ParserConnect(Parser)

export default Parser