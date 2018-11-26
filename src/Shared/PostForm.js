/* eslint-disable no-plusplus */

import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';


const FilePreview = ({ previewImages, removePreview }) => {
    if (previewImages.length > 0) {
        const renderImage = previewImages.map((i, index) => (
          <li onClick={() => removePreview(index)} key={index}>
            <div className="image-preview" style={{ backgroundImage: `url(${i})` }} />
          </li>
            ));

        return renderImage;
    }

    return (null);
};

class PostForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            previewImages: [],
        };
    }


    previewFile = (e) => {
        const { addImageData } = this.props;
        const images = [];
        for (let i = 0; i < e.currentTarget.files.length; i++) {
           const file = e.currentTarget.files[i];
           const image = URL.createObjectURL(file);
           images.push(image);
        }
        this.setState(
            prevState => ({
                previewImages: [...prevState.previewImages, ...images],
            }),
        // eslint-disable-next-line comma-dangle
        addImageData()
        );
    }

    removePreview = (index) => {
      const { previewImages } = this.state;
      const { removeImageData } = this.props;
      const copyImage = [...previewImages];
      removeImageData(index);
      copyImage.splice(index, 1);
      this.setState({
          previewImages: copyImage,
      });
    }

    render() {
        const { user, ...formRefs } = this.props;
        const { previewImages } = this.state;
        return (
          <form onSubmit={formRefs.submitPost} method="post">
            <textarea name="description" ref={formRefs.status} id="post-status" placeholder={`You know what this is for, ${user.displayName}`} />
            <div className="file-preview" style={{ height: previewImages.length > 0 ? '100px' : '0px' }}>
              <ul>
                <FilePreview
                  previewImages={previewImages}
                  removePreview={this.removePreview}
                />
              </ul>
            </div>
            <div className="dashboard-post-status-opt">
              <div className="dashboard-opt-left">
                <div className="dashboard-opt">
                  <label htmlFor="opt-image-upload" className="opt-cta">
                    <FontAwesomeIcon className="dashboard-icon dashboard-opt-icon" icon="image" />
                  </label>
                  <input
                    name="image"
                    onClick={(event) => { event.target.value = null; }}
                    accept="image/*"
                    ref={formRefs.imageUpload}
                    onChange={this.previewFile}
                    className="opt-none"
                    id="opt-image-upload"
                    type="file"
                    multiple
                  />
                </div>
                <div className="dashboard-opt">
                  <label id="gif-upload" htmlFor="opt-gif-upload" className="opt-cta">
                    <div className="dashboard-icon dashboard-opt-icon">GIF</div>
                  </label>
                  <input type="button" className="opt-none" id="opt-gif-upload" />
                </div>
              </div>
              <div className="dashboard-opt-right">
                <div className="dashboard-opt">
                  <label htmlFor="opt-twitter" className="opt-cta">
                    <FontAwesomeIcon className="dashboard-icon dashboard-opt-icon" icon={['fab', 'twitter']} />
                  </label>
                  <input className="opt-none" id="opt-twitter" type="button" />
                </div>
                <div className="dashboard-opt">
                  <label htmlFor="opt-submit" className="opt-cta">
                    <div id="opt-share" className="dashboard-icon dashboard-opt-icon">Share</div>
                  </label>
                  <input className="opt-none" id="opt-submit" type="submit" />
                </div>
              </div>
            </div>
          </form>
        );
    }
}


export default PostForm;
