import Page from '../components/page'
import Section from '../components/section'
import UploadFile from '../components/upload-file'
import UploadFileList from '../components/upload-filelist'
import UploadBlob from '../components/upload-blob'
import withData from '../providers/with-data'

const HomePage = () => (
  <Page title="Apollo upload examples">
    <img
      src="/static/apollo-upload-logo.svg"
      width="170"
      height="128"
      alt="Apollo upload logo"
    />
    <Section heading="Upload FileList">
      <UploadFileList />
    </Section>
    <Section heading="Upload File">
      <UploadFile />
    </Section>
    <Section heading="Upload Blob">
      <UploadBlob />
    </Section>
  </Page>
)

export default withData(HomePage)
