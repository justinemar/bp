import React from 'react';
import './home.css';
import { Route, Switch } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

const Streams = ({stream_list}) => 
   stream_list && stream_list.streams.length ? stream_list.streams.map((i, index) => {
        return (
            <div class="stream">
                <div class="stream-preview-box">
                    <div class="stream-preview-img" style={{backgroundImage: `url(${i.preview.large})`}}>
                        <div class="stream-head">
                            <div class="stream-title">
                                <h2>{i.channel.status}</h2>
                            </div>
                            <div class="stream-type">
                                <span class="round"></span>
                                <span class="type">{i.stream_type}</span>
                            </div>
                        </div>
                        <div class="play">
                            <FontAwesomeIcon id="play-icon" icon="play"/> 
                        </div>
                    </div>
                </div>
                <div class="stream-detail">
                    <div class="stream-logo" style={{backgroundImage: `url(${i.channel.logo})`}}>
                    </div>
                    <div class="stream-name">
                    {i.channel.display_name}
                    </div>
                    <div class="stream-viewers">
                    <FontAwesomeIcon id="eye-icon" icon="eye"/> 
                        {i.viewers}
                    </div>
                </div>
            </div>
        )
    }) : <h1>Loading Streams...</h1>

const Article = ({key, article}) => {
    return (
        <div class="news" key={key}>
            <div class="news-img-cover" style={{backgroundImage: `url(${article.media.image.original})`}}></div>
            {/* <div class="news-author front">
                {article.author}
            </div>
            <div class="news-date front">
                October 7 2018
            </div> */}
            <div class="news-title front">
                {article.shortTitle != '' ? article.shortTitle : article.title}
            </div>
        </div>
    )
}    
const Articles = ({articles, properties, articlesLength}) => {
    const indexOfLastArticle = properties.currentPage * properties.articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - properties.articlesPerPage;
        const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
        const renderArticles = currentArticles.map((article, index) => {
        return (
            <Article key={index} article={article}/>
        );
      })

      return renderArticles;
}

const PageNumbers = ({articles, properties, pageNumbers, handleClick}) => {
    for (let i = 1; i <= Math.ceil(articles.length / properties.articlesPerPage); i++) {
        pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => {
      return (
            <li
            key={number}
            id={number}
            onClick={handleClick}
            >
            {number}
            </li>
      );
    });

    return renderPageNumbers;
}

class Home extends React.Component{
    constructor(){
        super();
        this.state = {
            stream_list: null,
            articles: null,
            properties: {
                currentPage: 1,
                articlesPerPage: 3, 
            }
        }
    }

    componentDidMount(){
      this.getStreams();
      this.getArticles();
    }

    getArticles = () => {
        fetch('https://api.lolesports.com/api/v1/articles?getRelated=false&language=en&size=20', {
            method: 'GET'
        })
        .then(res => res.json())
        .then(res => {
            this.setState({
                articles: res.articles,
            })
        })
        .catch(err => new ErrorEvent(err))
    }

    getStreams = () => {
        fetch('/stream', {
            method:'GET',
            credentials: 'same-origin',
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + this.props.Auth.getToken()
            }
        })
        .then(res => res.json())
        .then(res => {
            if(!!this.props.Auth._checkStatus(res)){
                this.setState({
                    stream_list: res.data
                })
            };

        })
        .catch(err => console.log(err))
    }


    handlePagination = (event) => {
        this.setState({
            properties: {
                ...this.state.properties,
                currentPage: Number(event.target.id)
            }
        });
      }
    render(){
        const { stream_list, articles, properties} = this.state;
        const pageNumbers = [];
        const articlesLength = articles && articles.length ? articles.length : [];
        const articlesCopy = articles && articles.length ? [...articles] : [];
        return (
            <div class="section-selected-tab">
                <div class="esports-panel panel">
                    <div class="panel-head">
                        <h1>ESPORTS</h1>
                        <div class="category-list">
                            <ul>
                                <li>Most Popular</li>
                                <li>League of Legends</li>
                                <li>CS:GO</li>
                                <li>Dota 2</li>
                                <li><input type="text" placeholder="search..."/></li>
                            </ul>
                        </div>
                        <div class="news-box">
                            <Articles articles={articlesCopy} properties={properties}/>
                            <ul>
                                <PageNumbers handleClick={this.handlePagination} articles={articlesCopy}  pageNumbers={pageNumbers} properties={properties}/>
                            </ul>
                        </div>
                    </div>
                </div> 
                <div class="match-panel panel">
                    
                </div> 
                <div class="stream-panel panel">
                    <div class="panel-head">
                        <h1>Popular Streams</h1>
                    </div>
                    <div class="streams-box">
                        <Streams stream_list={stream_list}/>
                    </div>
                </div>
            </div>
        )
    }
}


export default Home;