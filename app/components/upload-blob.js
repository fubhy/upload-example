import { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Field from './field'

class UploadBlob extends Component {
  state = {
    name: '',
    content: ''
  }

  handleChange = ({ target: { name, value } }) =>
    this.setState({ [name]: value })

  handleSubmit = event => {
    event.preventDefault()

    const file = new Blob([this.state.content], { type: 'text/plain' })
    file.name = `${this.state.name}.txt`

    this.props.mutate({
      variables: { file },
      update: (proxy, { data: { fileUpload } }) => {
        console.log(fileUpload);
      }
    })
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <Field>
          <input
            name="name"
            placeholder="Name"
            required
            value={this.state.name}
            onChange={this.handleChange}
          />{' '}
          .txt
        </Field>
        <Field>
          <textarea
            name="content"
            placeholder="Content"
            required
            value={this.state.content}
            onChange={this.handleChange}
          />
        </Field>
        <button>Upload</button>
      </form>
    )
  }
}

export default graphql(gql`
  mutation($file: Upload!) {
    fileUpload(file: $file) {
      entity {
        ... on File {
          url
        }
      }
    }
  }
`)(UploadBlob)
