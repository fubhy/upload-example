import { graphql, gql } from 'react-apollo'
import uploadsQuery from '../queries/uploads'

const SingleUploader = ({ mutate }) => {
  const handleChange = ({ target }) =>
    target.validity.valid &&
    mutate({
      variables: {
        file: target.files[0]
      },
      refetchQueries: [
        {
          query: uploadsQuery
        }
      ]
    })

  return <input type="file" required onChange={handleChange} />
}

export default graphql(gql`
  mutation($file: Upload!) {
    singleUpload(file: $file) {
      id
      name
      type
      size
      path
    }
  }
`)(SingleUploader)
