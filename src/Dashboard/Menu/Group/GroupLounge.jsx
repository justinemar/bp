/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import LoungePlaceHolder from '../../LoadingPlaceholder/LoungePlaceHolder';
import PostForm from '../../PostForm';

class GroupLounge extends React.Component {
    state = {
      loungeData: null,
      ImagesData: [],
    }


    componentDidMount() {
      const { match: { params } } = this.props;
      const groupName = params.group.replace('@', '');
      fetch(`/groups/${groupName}`, {
        method: 'GET',
        credentials: 'same-origin',
      })
      .then(res => res.json())
      .then((res) => {
        this.setState({
          loungeData: res[0],
        });
        console.log(res[0]);
      });
    }

    addImageData = () => {
      const fileList = Array.from(this.imageUpload.files);
      console.log(fileList);
      this.setState(
          prevState => ({
              ImagesData: [...prevState.ImagesData, ...fileList],
          }),
      );
    }

    removeImageData = (index) => {
      const { ImagesData } = this.state;
      const data = [...ImagesData];
      data.splice(index, 1);
      this.setState({
          ImagesData: data,
      });
    }

    render() {
      const { loungeData } = this.state;
      const { user } = this.props;
      const members = loungeData && loungeData !== null ? loungeData.members.map(i => (
        <div className="user-info slide-in-fwd-center">
          <div className="user-status">
            <div className="group-master-icon" style={{ backgroundImage: `url(${i.photo_url})` }} />
          </div>
          <span className="user-name">{i.display_name}
          </span>
        </div>
      )) : <LoungePlaceHolder />;
      const loungeActive = loungeData && loungeData !== null ? (
        <div className="group-lounge">
          <div className="group-lounge-info">
            <div className="group-lounge-logo">
              <div className="logo" style={{ backgroundImage: `url(${loungeData.logo})` }} />
              <h1>{loungeData.name}</h1>
            </div>
            <div className="group-users">
              <div className="group-master">
                <h2>GROUP MASTER</h2>
                <div className="user-info slide-in-fwd-center">
                  <div className="user-status">
                    <div className="group-master-icon" style={{ backgroundImage: `url(${loungeData.owner.photo_url})` }} />
                  </div>
                  <span className="user-name">{loungeData.owner.display_name} <FontAwesomeIcon className="owner-crown" icon="crown" />
                  </span>
                </div>
              </div>
              <div className="group-members">
                <h2>MEMBERS</h2>
                {members}
              </div>
            </div>
          </div>
          <div className="group-wall">
            {/* undecided contents */}
            <PostForm
              user={user}
              status={i => this.status = i}
              imageUpload={i => this.imageUpload = i}
              submitPost={this.submitPost}
              removeImageData={this.removeImageData}
              addImageData={this.addImageData}
            />
            <div className="group-posts">
              <div className="group-post scale-up-center">
                <div className="user-icon" style={{ backgroundImage: `url(${loungeData.owner.photo_url})` }} />
                <div className="group-post-content">
                  <h3>{loungeData.owner.display_name} </h3>
                  <span>{loungeData.description}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
) : <LoungePlaceHolder />;
        return (
          <div className="section-selected-tab">
            {loungeActive}
          </div>
        );
    }
}


export default GroupLounge;
