/* eslint-disable react/prop-types */
import './style.scss';

import React, { Component } from 'react';

import { Col, Icon, message, Row, Spin, Upload } from 'antd';

import ContentHeader from '../../components/ContentHeader';
import ComponentsParametersTable from '../../components/Component/ParametersTable';
import EditableTitle from '../../components/EditableTitle';
import NewParameterForm from '../../components/Component/NewParameterForm';

import E404 from '../E404'; // 404 error

import * as componentsServices from '../../services/componentsApi';

const { Dragger } = Upload;

export default class ComponentDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      details: { name: null, uuid: null, file: null, parameters: [] },
    };
  }

  componentDidMount() {
    this.fetchDetails();
  }

  fetchDetails = async () => {
    this.setState({ loading: true });
    const { match } = this.props;
    const fileDetails = { uid: 1, name: null, status: 'done', url: null };
    const auxDetails = { name: null, uuid: null, file: null, parameters: [] };
    const component = await componentsServices.getComponent(
      match.params.componentId
    );

    if (component) {
      auxDetails.uuid = component.data.payload.uuid;
      auxDetails.name = component.data.payload.name;

      if (component.data.payload.parameters) {
        auxDetails.parameters = component.data.payload.parameters;
      }

      if (component.data.payload.file) {
        const dir = `components/${auxDetails.uuid}/`;
        fileDetails.name = component.data.payload.file.replace(dir, '');
        fileDetails.url = `${componentsServices.downloadUrl}/${auxDetails.uuid}/${fileDetails.name}`;
        auxDetails.file = fileDetails;
      }
    }

    this.setState({ details: auxDetails, loading: false });
  };

  getErrorPage = () => {
    const { loading } = this.state;
    return loading ? <Spin /> : <E404 />;
  };

  renderBody() {
    const { loading, details } = this.state;

    if (loading) return <Spin />;

    const DraggerProps = {
      multiple: false,
      action: `${componentsServices.uploadUrl}/${details.uuid}`,
      defaultFileList: details.file ? [details.file] : [],
      beforeUpload: (file) => {
        const upFile = file;
        upFile.url = `${componentsServices.downloadUrl}/${details.uuid}/${file.name}`;
      },
      onChange(info) {
        const { status } = info.file;
        if (status === 'done') {
          message.success(`${info.file.name} salvo com sucesso.`);
        } else if (status === 'removed') {
          if (!info.file.error) {
            message.success(`${info.file.name} removido com sucesso.`);
          }
        } else if (status === 'error') {
          if (info.file.error.status === 400) {
            message.error(`Só é possível realizar o upload de um arquivo!`);
          } else {
            message.error(`Falha no upload do arquivo ${info.file.name}`);
          }
        }
      },
      onRemove: async (file) => {
        if (!file.error) {
          const response = await componentsServices.deleteFiles(details.uuid, [
            file.name,
          ]);
          if (!response) {
            return false;
          }
        }
        return true;
      },
    };

    const onSubmit = async (values) => {
      const newParameter = {
        name: null,
        type: null,
        required: null,
        default: null,
        details: null,
      };
      newParameter.name = values.name;
      newParameter.type = values.type;
      newParameter.required = values.required;
      newParameter.default = values.defaultValue;
      newParameter.details = values.details;

      const { uuid, parameters } = details;
      let checkParameters = true;
      parameters.forEach((parameter) => {
        if (parameter.name === newParameter.name) {
          checkParameters = false;
        }
      });

      if (checkParameters) {
        parameters.push(newParameter);
        const response = await componentsServices.updateParameters(
          uuid,
          parameters
        );
        if (response) {
          this.setState(details);
          message.success(
            `Parâmetro ${newParameter.name} adicionado com sucesso`
          );
          return true;
        }
        return false;
      }
      message.error('Já existe parâmetro com esse nome adicionado');
      return false;
    };

    return (
      <Row className='row'>
        <Col span={14} className='col'>
          <h2>Definição de parâmetros</h2>
          <h1>Adicione os parâmetros que serão configurados no experimento.</h1>
          <NewParameterForm onSubmit={onSubmit} />
        </Col>
        <Col span={10} className='col'>
          <Dragger {...DraggerProps}>
            <p className='ant-upload-drag-icon'>
              <Icon type='inbox' />
            </p>
            <p className='ant-upload-text'>
              Clique ou arraste o arquivo para esta área para fazer o upload
            </p>
          </Dragger>
        </Col>
      </Row>
    );
  }

  renderParametersTable() {
    const { loading, details } = this.state;

    if (loading) return <Spin />;

    const handleDelete = async (removedParameter) => {
      const { uuid, parameters } = details;
      const index = parameters.indexOf(removedParameter, 0);
      if (index > -1) {
        parameters.splice(index, 1);
        await componentsServices.updateParameters(uuid, parameters);
        this.setState(details);
        message.success(
          `Parâmetro ${removedParameter.name} removido com sucesso`
        );
      } else {
        message.error(`Erro ao remover parâmetro ${removedParameter.name}`);
      }
    };

    return (
      <ComponentsParametersTable
        parameterList={details.parameters}
        onDelete={handleDelete}
      />
    );
  }

  render() {
    const { details } = this.state;

    const { history } = this.props;
    function handleClick() {
      history.push('/components');
    }

    return details.uuid ? (
      <div className='componentPage'>
        <ContentHeader
          title={<EditableTitle details={details} fetch={this.fetchDetails} />}
          subTitle={details.uuid}
          onBack={handleClick}
        />

        <div className='componentPageBody'>
          <div className='body'>
            {this.renderBody()}
            <br />
            {this.renderParametersTable()}
          </div>
        </div>
      </div>
    ) : (
      this.getErrorPage()
    );
  }
}
