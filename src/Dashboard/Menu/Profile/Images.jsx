import React from 'react';


class Images extends React.Component{

    constructor(){
        super()
        this.state = {
            images: null,
        }

        this.requestController = new AbortController();
    }


    componentWillUnmount(){
        this.requestController.abort();
    }

    componentDidMount(){

        const { Auth, match } = this.props;
        fetch(`/photos/user/${match.params.user_id}`, {
            method: 'GET',
            signal: this.requestController.signal,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + Auth.getToken()
            }
        })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            this.setState({
                images: res.data
            })
        })
        .catch(err => console.log(err))
    }

    render(){
        const { images } = this.state;
        return (
            <div class="image-wrapper">
              <Image images={images}/>
            </div>
        )
    }
}


const Image = ({images}) => {
    let renderImage = 'Nothing to see here :c'
    if(images && images.length){
        renderImage = images.map(subArray => {
            return subArray.imageArray.map(img => {
                return (
                    <div class="image">
                        <div class="image-main" style={{backgroundImage: `url(${img})`}}>
                        </div> 
                    </div>
                )
            })
        })
    
    }
    
    return renderImage;
}




export default Images;