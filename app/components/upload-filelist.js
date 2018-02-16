import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const UploadFileList = ({ mutate }) => {
  const handleChange = ({ target: { validity, files } }) =>
    validity.valid &&
    mutate({
      variables: { files },
      update: (proxy, { data: { multipleUpload } }) => {
        console.log(multipleUpload);
      }
    })

  return <input type="file" multiple required onChange={handleChange} />
}

export default graphql(gql`
  mutation($files: [Upload!]!) {
    fileUpload(file: $file) {
      entity {
        ... on File {
          url
        }
      }
    }
  }
`)(UploadFileList)
