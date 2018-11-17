/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable react/prefer-stateless-function */
import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

class GroupsWizard extends React.Component {
    constructor() {
      super();
      this.state = {
        groupLogo: '',
        logoData: null,
      };
    }

    setImage = () => {
      const image = URL.createObjectURL(this.logo.files[0]);
      this.setState({
        groupLogo: image,
        logoData: this.logo.files[0],
      });
    }

   createGroup = () => {
     const { user } = this.props;
     const { logoData } = this.state;
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
      .then((res) => {
          if (res.code === 200) {
              console.log(res);
          }
      })
      .catch(err => console.log(err));
   }

    render() {
      const { groupLogo } = this.state;
        return (
          <div className="section-selected-tab">
            <div className="background" />
            <div className="create-panel">
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
              <button onClick={this.createGroup} type="button" className="panel-btn">LET'S GO</button>
            </div>
          </div>
        );
    }
}


export default GroupsWizard;
