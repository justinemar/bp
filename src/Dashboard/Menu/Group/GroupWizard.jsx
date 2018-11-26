/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import ReturnArrow from '../../../Shared/ReturnArrow';
import Spinner from '../../../Shared/Spinner';
import AuthService from '../../../utils/authService';

class GroupsWizard extends React.Component {
    constructor() {
      super();
      this.state = {
        groupLogo: '',
        logoData: null,
        loading: false,
      };
      this.AuthService = new AuthService();
    }

    setImage = () => {
      const image = URL.createObjectURL(this.logo.files[0]);
      this.setState({
        groupLogo: image,
        logoData: this.logo.files[0],
      });
    }

   createGroup = () => {
     const { user, history, requireVerifiedEmail } = this.props;
     const { logoData } = this.state;
     this.setState({
       loading: true,
     });

     if (!this.AuthService.getProfile().verified) {
        requireVerifiedEmail({
          message: 'A valid email is required for this feature',
          code: 403,
          type: 'error',
        });

        this.setState({
          loading: false,
        });

        return;
     }

     const formData = new FormData();
     formData.append('uid', user.id);
     formData.append('logo', logoData);
     formData.append('description', this.desc.value);
     formData.append('name', this.name.value);
     formData.append('public', this.public.checked);
     fetch('/groups', {
        method: 'POST',
        credentials: 'same-origin',
        body: formData,
      })
      .then(res => this.AuthService.processResponse(res))
      .then((res) => {
          const { statusCode, data } = res;
          if (statusCode === 200) {
            return history.push(`/dashboard/groups/@${data.name}`);
          }

          if (statusCode === 403) {
            return this.AuthService.requireVerifiedEmail(data);
          }
      })
      .catch(err => console.log(err));
   }

    render() {
      const { groupLogo, loading } = this.state;
      const { history } = this.props;
        return (
          <div className="section-selected-tab">
            <div className="background" />
            <div className="create-panel">
              <ReturnArrow history={history} />
              <h1>CREATE YOUR GROUP</h1>
              <div className="create-header">
                <div className="logo-wrapper">
                  <div className="logo" style={{ backgroundImage: `url(${groupLogo})` }}>
                    <label htmlFor="logoUpload">
                      <FontAwesomeIcon className="awesomeLogo" icon="image" />
                    </label>
                    <input
                      ref={input => this.logo = input}
                      onChange={this.setImage}
                      className="opt-none"
                      name="image"
                      type="file"
                      accept="image/jpeg, image/png"
                      id="logoUpload"
                    />
                  </div>
                </div>
                <div className="group-setting">
                  <input
                    ref={input => this.name = input}
                    name="groupName"
                    type="text"
                    placeholder="YourGroupName"
                    maxLength="20"
                  />
                  <input ref={input => this.public = input} name="groupRequirement" type="checkbox" /> Make this group public <br />

                </div>
              </div>
              <div className="description-wrapper">
                <p>Describe what your group is all about. <span>(Max. 150 Characrers)</span></p>
                <textarea ref={input => this.desc = input} placeholder="Description" />
              </div>
              <button onClick={this.createGroup} type="button" className="panel-btn"><Spinner fetchInProgress={loading} defaultRender="LET'S GO" /></button>
            </div>
          </div>
        );
    }
}


export default GroupsWizard;
