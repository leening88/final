import React from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { Body, Title, Right, Container, Header, Content, Button, Icon, List, ListItem, Text } from 'native-base';

export default class App extends React.Component {
  constructor() {
    super();
    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      booleans: []
    }
  }

  // Retrieve the list of ideas from Airtable
  getBooleans() {
    // Airtable API endpoint, replace with your own
    let airtableUrl = "https://api.airtable.com/v0/appv2J7pQA5VflqEp/booleans";

    // Needed for Airtable authorization, replace with your own API key
    let requestOptions = {
      headers: new Headers({
        'Authorization': 'Bearer key2eSZVrSgMH3FRE'
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(user => user.json()).then(json => {
      this.setState({
        booleans: json.records
      });
    });
  }

  // Runs when the application loads (i.e. the "App" component "mounts")
  componentDidMount() {
    this.getBooleans(); // refresh the list when we're done
  }

  // Swipe right for true
  trueBoolean(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appv2J7pQA5VflqEp/booleans/"  + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer key2eSZVrSgMH3FRE', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          user: data.fields.user = 'true'
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(user => user.json()).then(json => {
      this.getBooleans(); // refresh the list when we're done
    });
  }

  // Swipe left for false
  falseBoolean(data, secId, rowId, rowMap) {
    // Slide the row back into place
    rowMap[`${secId}${rowId}`].props.closeRow();

    // Airtable API endpoint
    let airtableUrl = "https://api.airtable.com/v0/appv2J7pQA5VflqEp/booleans/" + data.id;

    // Needed for Airtable authorization
    let requestOptions = {
      method: 'PATCH',
      headers: new Headers({
        'Authorization': 'Bearer key2eSZVrSgMH3FRE', // replace with your own API key
        'Content-type': 'application/json'
      }),
      body: JSON.stringify({
        fields: {
          user: data.fields.user = 'false'
        }
      })
    };

    // Form the request
    let request = new Request(airtableUrl, requestOptions);

    // Make the request
    fetch(request).then(user => user.json()).then(json => {
      this.getBooleans(); // refresh the list when we're done
    });
  }

  // Refresh user responses - doesn't work ):
  refreshBoolean() {
    // Create a new array that has all answers removed
    let newUserData = []
    // Set state
    this.setState({
      user: newUserData
    });
  }

  // The UI for each row of data
  renderRow(data) {
    return (
      <ListItem style={{ paddingLeft: 20, paddingRight: 20,
       }}>
        <Body>
          <Text>{data.fields.prompt}</Text>
        </Body>
        <Right>
          <Text style={{color:'purple'}}>{data.fields.user}</Text>
        </Right>
      </ListItem>
    )
  }

  // The UI for what appears when you swipe right
  renderSwipeRight(data, secId, rowId, rowMap) {
    return (
      <Button full success onPress={() => this.trueBoolean(data, secId, rowId, rowMap)}>
        <Icon active name="checkmark" />
      </Button>
    )
  }

  // The UI for what appears when you swipe left
  renderSwipeLeft(data, secId, rowId, rowMap) {
    return (
      <Button full danger onPress={() => this.falseBoolean(data, secId, rowId, rowMap)}>
        <Icon active name="close" />
      </Button>
    )
  }

  render() {
    let rows = this.ds.cloneWithRows(this.state.booleans);
    return (
      <Container>
        <Header>
          <Body>
            <Title>Python Booleans Exercise</Title>
          </Body>
        </Header>
        <Content>
          <List
            dataSource={rows}
            renderRow={(data) => this.renderRow(data)}
            renderLeftHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeRight(data, secId, rowId, rowMap)}
            renderRightHiddenRow={(data, secId, rowId, rowMap) => this.renderSwipeLeft(data, secId, rowId, rowMap)}
            leftOpenValue={75}
            rightOpenValue={-75}
          />
          <Button block icon light onPress={() => this.refreshBoolean()}>
          <Icon name='refresh' />
          <Text>refresh</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
