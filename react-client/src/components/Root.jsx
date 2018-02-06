import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import PropTypes from 'prop-types';
import RouteProps from 'react-route-props';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import $ from 'jquery';
import NavHeader from './NavHeader.jsx';
import App from './App.jsx';
import Developer from './Developer.jsx';
import Project from './Project.jsx';
import UploadForm from './UploadForm.jsx';
import PleaseLogIn from './PleaseLogIn.jsx';
import Ideas from './Ideas.jsx';

class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      session_id: '',
      username: '',
      name: '',
      projects: [],
      userId: null,
      techFilter: [],
      isCheckingLogIn: false
    };

    this.checkSignIn = this.checkSignIn.bind(this);
    this.getProjects = this.getProjects.bind(this);
    this.searchByUserInput = this.searchByUserInput.bind(this);
    this.getProjectsByTechs = this.getProjectsByTechs.bind(this);
    this.handleTechs = this.handleTechs.bind(this);
    this.handleGetLatest = this.handleGetLatest.bind(this);
  }

  componentWillMount() {
    this.checkSignIn();
  }

  checkSignIn() {
    this.setState({
      isCheckingLogIn: true
    }, function () {
      axios.get('/checkSession')
        .then((response) => {
          this.setState({
            isCheckingLogIn: false,
            session_id: response.data.session_id,
            username: response.data.git_username,
            name: response.data.name,
            userId: response.data.id
          });
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  getProjects() {
    console.log('checking for projects...');
    axios.get('/projects')
      .then((response) => {
        this.setState({
          projects: response.data
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  searchByUserInput(result) {
    console.log('result in searchByUserProject', result[0].project_name);
    const that = this;
    $.ajax({
      url: `/searchProjects?title=${result[0].project_name}`,
      success: (response) => {
        console.log('RESPONSE IN SearchBar', response);

        that.setState({
          projects: response
        });
      },
      error: () => {
        console.log('check access token error');
      }
    });
  }

  getProjectsByTechs(techs) {
    const techQuery = queryString.stringify({
      techs
    });
    axios.get(`/projects?${techQuery}`)
      .then((response) => {
        this.setState({
          projects: response.data
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleTechs(e, data) {
    this.setState({ techFilter: data.value }, function () {
      this.getProjectsByTechs(this.state.techFilter);
    });
  }

  handleGetLatest() {
    this.setState({
      techFilter: []
    }, function () {
      this.getProjects();
    });
  }

  render() {
    return (
      <Router>
        <div>
          <NavHeader
            sessionId={this.state.session_id}
            username={this.state.username}
            name={this.state.name}
          />
          <Switch>
            <RouteProps
              exact
              path="/"
              component={App}
              sessionId={this.state.session_id}
              username={this.state.username}
              name={this.state.name}
              projects={this.state.projects}
              techFilter={this.state.techFilter}
              checkSignIn={this.checkSignIn}
              getProjects={this.getProjects}
              searchByUserInput={this.searchByUserInput}
              getProjectsByTechs={this.getProjectsByTechs}
              handleGetLatest={this.handleGetLatest}
              handleTechs={this.handleTechs}
            />
            <RouteProps
              path="/create"
              component={UploadForm}
              sessionId={this.state.session_id}
              username={this.state.username}
              userId={this.state.userId}
            />
            <Route
              path="/PleaseLogIn"
              component={PleaseLogIn}
            />
            <RouteProps
              path="/apps/:id"
              component={Project}
              username={this.state.username}
            />
            <RouteProps
              path="/users/:username"
              component={Developer}
              sessionId={this.state.session_id}
              username={this.state.username}
              name={this.state.name}
            />
            <RouteProps
              path="/ideas"
              component={Ideas}
              username={this.state.username}
              name={this.state.name}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Root;
