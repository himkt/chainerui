import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
} from 'reactstrap';

import * as uiPropTypes from '../store/uiPropTypes';
import Check from './FormControl/Check';


class ExperimentsTableConfigurator extends React.Component {
  constructor(props) {
    super(props);
    this.handleModalShow = this.handleModalShow.bind(this);
    this.handleModalHide = this.handleModalHide.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleIsGrouped = this.handleIsGrouped.bind(this);

    this.state = {
      showModal: false,
    };
  }

  handleModalShow() {
    this.setState({
      showModal: true,
    });
  }

  handleModalHide() {
    this.setState({
      showModal: false,
    });
  }

  handleChange(prefix, event) {
    const { projectConfig } = this.props;
    const { tableState } = projectConfig;
    const {
      knownLogKeysConfig = {},
      knownArgKeysConfig = {},
      isGrouped = false,
    } = tableState;

    if (prefix === 'logKey') {
      const nextKnownLogKeysConfig = {
        ...knownLogKeysConfig,
        [event.target.name]: {
          ...knownLogKeysConfig[event.target.name],
          hidden: !event.target.checked,
        },
      };

      this.props.onTableColumnsVisibilityUpdate(this.props.project.id, nextKnownLogKeysConfig, knownArgKeysConfig, isGrouped);
    } else {
      const nextKnownArgKeysConfig = {
        ...knownArgKeysConfig,
        [event.target.name]: {
          ...knownArgKeysConfig[event.target.name],
          hidden: !event.target.checked,
        },
      };

      this.props.onTableColumnsVisibilityUpdate(this.props.project.id, knownLogKeysConfig, nextKnownArgKeysConfig, isGrouped);
    }
  }

  handleIsGrouped(event) {
    const { tableState } = this.props.projectConfig;

    this.props.onTableColumnsVisibilityUpdate(
      this.props.project.id, tableState.hiddenLogKeys, tableState.hiddenArgKeys,
      event.target.checked
    );
  }

  render() {
    const { stats, projectConfig } = this.props;
    const { logKeys, argKeys } = stats;
    const { tableState } = projectConfig;
    const {
      knownLogKeysConfig = {},
      knownArgKeysConfig = {},
      isGrouped = false,
    } = tableState;

    return (
      <div>
        <div className="form-inline">
          <Button color="secondary" className="my-2" onClick={this.handleModalShow}>
            Table settings
          </Button>
          <Check
            type="checkbox"
            className="ml-2"
            checked={isGrouped}
            onChange={this.handleIsGrouped}
          >
            Grouping
          </Check>
        </div>

        <Modal isOpen={this.state.showModal} toggle={this.handleModalHide}>
          <ModalHeader>
            Edit table columns visibility
          </ModalHeader>
          <ModalBody>
            <Form>
              <legend>Log Keys</legend>
              {
                logKeys.map((l) => (
                  <Check
                    key={`logKey.${l}`}
                    type="checkbox"
                    name={l}
                    checked={!(knownLogKeysConfig[l] || {}).hidden}
                    onChange={(e) => this.handleChange('logKey', e)}
                  >
                    {l}
                  </Check>
                ))
              }
              <hr />
              <legend>Arg Keys</legend>
              {
                argKeys.map((a) => (
                  <Check
                    key={`argKey.${a}`}
                    type="checkbox"
                    name={a}
                    checked={!(knownArgKeysConfig[a] || {}).hidden}
                    onChange={(e) => this.handleChange('argKey', e)}
                  >
                    {a}
                  </Check>
                ))
              }
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.handleModalHide}>Close</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

ExperimentsTableConfigurator.propTypes = {
  project: uiPropTypes.project.isRequired,
  projectConfig: uiPropTypes.projectConfig.isRequired,
  stats: uiPropTypes.stats.isRequired,
  onTableColumnsVisibilityUpdate: PropTypes.func.isRequired,
};

export default ExperimentsTableConfigurator;
