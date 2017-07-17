import React from 'react'
let message = require('antd/lib/message')
let TimePicker = require('antd/lib/time-picker')
let Switch = require('antd/lib/switch')
let Tag = require('antd/lib/tag')
let Modal = require('antd/lib/modal')
import AppActions from '../../actions/AppActions'
import AppStore from '../../stores/AppStore'
import constants from '../../const'
import _ from 'lodash'

class ActiveStatus extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStatusList: [],
      activeStatusListAll:[],
      messageModal:false,
      messageContent:''
    }
  }

  componentDidMount() {
    this.unsubscribe = AppStore.listen(function(state) {
      this.setState(state)
    }.bind(this))

    AppActions.getActiveStatusList()

    // start to get active collector list in loop
    this.loop = setInterval(function() {
      AppActions.getActiveStatusList()
    }, constants.STATUS_REFRESH_INTERVAL)
  }

  componentWillUnmount() {
    // stop list loop
    clearInterval(this.loop)

    if (_.isFunction(this.unsubscribe))
      this.unsubscribe();
  }

  setActiveSwitch(switcher) {
    console.log(this)
    let id = this['data-id']
    AppActions.setCollectorSwitch({ id: id, switch: switcher, category: 'active'})
  }

  showAllStdout(index, e){
    console.log('index:',index)
    let id = e.target.getAttribute("data-id")
    let messageContent = this.state.activeStatusListAll[index].status.lastActivity.stdout
    if(messageContent){
      this.setState({
        messageModal:true,
        messageContent:messageContent
      })
    }
  }

  showAllStderr(index, e){
    let id = e.target.getAttribute("data-id")
    let messageContent = this.state.activeStatusListAll[index].status.lastActivity.stderr
    if(messageContent){
      this.setState({
        messageModal:true,
        messageContent:messageContent
      })
    }
  }


  showPartStatus(index, e){
    this.setState({
      messageModal:false
    })
  }

  render() {
    // render status list
    let createActiveStatus = (line, index) => {
      // line = { _id, name, ts, type, trigger, cmd, param, host, status }
      // status = { runningFlag, lastActivity }
      // lastActivity = { ts, success[, stdout, stderr] }
      let activeStatus

      let date = new Date(line.ts)
      date = date.toLocaleString()
      let idx = _.indexOf(this.state.activeStatusChecklist, line._id)
      // console.log('createActiveStatus', this.state.activeStatusChecklist, line._id, idx)
      let triggerDate = new Date(parseInt(line.trigger))
      // create status columns
      let lastActivityTs
      let lastActivityMsg
      let execCount
      let operation
      if (line.status.lastActivity != null) {
        execCount = line.status.lastActivity.execCounter
        lastActivityTs = new Date(parseInt(line.status.lastActivity.ts)).toLocaleString()
        // console.log(JSON.stringify(line))
        switch (line.status.lastActivity.status) {
          case 'Success':
            if(line.status.lastActivity.stdout ){
              lastActivityMsg = <td>
                <Tag  color="blue">stdout</Tag>
                <Tag onClick={this.showAllStdout.bind(this, index)} color="blue">+</Tag>
                { line.status.lastActivity.stdout }
                <br />
                <Tag  color="green">stderr</Tag>
                { line.status.lastActivity.stderr }
              </td>
            }
            if(line.status.lastActivity.stderr){
              lastActivityMsg = <td>
                <Tag  color="blue">stdout</Tag>
                { line.status.lastActivity.stdout }
                <br />
                <Tag  color="green">stderr</Tag>
                <Tag onClick={this.showAllStderr.bind(this, index)} color="green">+</Tag>
                { line.status.lastActivity.stderr }
              </td>
            }
            if(line.status.lastActivity.stdout  && line.status.lastActivity.stderr){
              lastActivityMsg = <td>
                <Tag  color="blue">stdout</Tag>
                <Tag onClick={this.showAllStdout.bind(this, index)} color="blue">+</Tag>
                { line.status.lastActivity.stdout }
                <br />
                <Tag  color="green">stderr</Tag>
                <Tag onClick={this.showAllStderr.bind(this, index)} color="green">+</Tag>
                { line.status.lastActivity.stderr }
              </td>
            }
          break

          case 'Error':
            if(line.status.lastActivity.stdout ){
              lastActivityMsg = <td>
                <Tag  color="blue">stdout</Tag>
                <Tag onClick={this.showAllStdout.bind(this, index)} color="blue">+</Tag>
                { line.status.lastActivity.stdout }
                <br />
                <Tag  color="red">stderr</Tag>
                { line.status.lastActivity.stderr }
              </td>
            }
            if(line.status.lastActivity.stderr){
              lastActivityMsg = <td>
                <Tag  color="blue">stdout</Tag>
                { line.status.lastActivity.stdout }
                <br />
                <Tag  color="red">stderr</Tag>
                <Tag onClick={this.showAllStderr.bind(this, index)} color="red">+</Tag>
                { line.status.lastActivity.stderr }
              </td>
            }
            if(line.status.lastActivity.stdout  && line.status.lastActivity.stderr){
              lastActivityMsg = <td>
                <Tag  color="blue">stdout</Tag>
                <Tag onClick={this.showAllStdout.bind(this, index)} color="blue">+</Tag>
                { line.status.lastActivity.stdout }
                <br />
                <Tag  color="red">stderr</Tag>
                <Tag onClick={this.showAllStderr.bind(this, index)} color="red">+</Tag>
                { line.status.lastActivity.stderr }
              </td>
            }
          break

          default:
          execCount = 0
          lastActivityTs = 'N/A'
          lastActivityMsg = <td> <Tag color="yellow"> Pending </Tag> </td>
          break
        }
      }
      else {
        execCount = 0
        lastActivityTs = 'N/A'
        lastActivityMsg = <td> <Tag color="yellow"> N/A </Tag> </td>
      }

      if (line.status.runningFlag) {
        operation = <Switch data-id={line._id}
          data-switch={false}
          defaultChecked={true}
          onChange={this.setActiveSwitch}
          size="small" />
      }
      else {
        operation = <Switch data-id={line._id}
          data-switch={true}
          defaultChecked={false}
          onChange={this.setActiveSwitch}
          size="small" />
      }

      if (idx == -1)
        activeStatus = <tr key={ index }>
          <td>{ line.name }</td>
          <td>{ date }</td>
          <td>{ line.type }</td>
          <td>
            <TimePicker
              defaultValue={ triggerDate }
              size="small"
              disabled
            />
          </td>
          <td>{ line.cmd }</td>
          <td>{ line.param }</td>
          <td>{ line.host }</td>
          <td>{ execCount }</td>
          <td>{ lastActivityTs }</td>
          { lastActivityMsg }
          <td>{ operation }</td>
        </tr>
      else
        activeStatus = <tr key={ index }>
          <td>{ line.name }</td>
          <td>{ date }</td>
          <td>{ line.type }</td>
          <td>
            <TimePicker
              defaultValue={ triggerDate }
              size="small"
              disabled
            />
          </td>
          <td>{ line.cmd }</td>
          <td>{ line.param }</td>
          <td>{ line.host }</td>
          <td>{ execCount }</td>
          <td>{ lastActivityTs }</td>
          { lastActivityMsg }
          <td>{ operation }</td>
        </tr>

      return activeStatus
    }

    let activeStatusTable = this.state.activeStatusList.map(createActiveStatus.bind(this))

    return (
      <div>
        <Modal
          title = "Last Activity Message"
          visible = {this.state.messageModal}
          onOk = {this.showPartStatus.bind(this)}
          onCancel = {this.showPartStatus.bind(this)}
          footer = {null}
          className = 'statusModal'
        >
          {this.state.messageContent}
        </Modal>
        <div className=" p-b-10 p-t-10">
          <table id="demo-custom-toolbar"  data-toggle="table"
                     data-toolbar="#demo-delete-row"
                     data-search="true"
                     data-show-refresh="true"
                     data-show-toggle="true"
                     data-show-columns="true"
                     data-sort-name="id"
                     data-page-list="[5, 10, 20]"
                     data-page-size="5"
                     data-pagination="true" data-show-pagination-switch="true" className="table table-bordered table-hover">
            <thead>
              <tr>
                <th data-field="name" data-sortable="true">Name</th>
                <th data-field="date" data-sortable="true" data-formatter="dateFormatter">Date</th>
                <th data-field="amount" data-align="center" data-sortable="true" data-sorter="">Type</th>
                <th data-field="status" data-align="center" data-sortable="true" data-formatter="">Trigger</th>
                <th data-field="command" data-align="center" data-sortable="true" data-sorter="">Command</th>
                <th data-field="parameter" data-align="center" data-sortable="true" data-sorter="">Parameter</th>
                <th data-field="host" data-align="center" data-sortable="true" data-sorter="">Host</th>
                <th data-field="execCount" data-align="center" data-sortable="true" data-sorter="">Exec Count</th>
                <th data-field="lastTs" data-align="center" data-sortable="true" data-sorter="">Last Activity Time</th>
                <th data-field="lastMsg" data-align="center" data-sortable="true" data-sorter="">Last Activity Message</th>
                <th data-field="operation" data-align="center" data-sortable="true" data-sorter="">Operation</th>
              </tr>
            </thead>
            <tbody>
              { activeStatusTable }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

ActiveStatus.propTypes = {

}

ActiveStatus.defaultProps = {

}

export default ActiveStatus


