import { graphql } from 'react-apollo'
import gql from 'graphql-tag'

const UploadFile = ({ mutate }) => {
  const handleChange = ({ target: { validity, files: [file] } }) =>
    validity.valid &&
    mutate({
      variables: { file },
      update: (proxy, { data: { fileUpload } }) => {
        console.log(fileUpload);
      }
    })

  return <input type="file" required onChange={handleChange} />
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
`)(UploadFile)
