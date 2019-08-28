/* eslint-disable camelcase */
/* eslint-disable implicit-arrow-linebreak */
/* eslint-disable no-confusing-arrow */
// eslint-disable-next-line camelcase
import React from 'react';
import './home.css';
import { Route, Switch } from 'react-router-dom';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';


const Streams = ({ stream_list }) =>
   stream_list && stream_list.streams ? stream_list.streams.map((i, index) => (
     <div className="stream" key={index}>
       <div className="stream-preview-box">
         <div className="stream-preview-img" style={{ backgroundImage: `url(${i.preview.large})` }}>
           <div className="stream-head">
             <div className="stream-title">
                    <h2>{i.channel.status}</h2>
                  </div>
             <div className="stream-type">
                    <span className="round" />
                    <span className="type">{i.stream_type}</span>
                  </div>
           </div>
           <div className="play">
             <FontAwesomeIcon id="play-icon" icon="play" />
           </div>
         </div>
       </div>
       <div className="stream-detail">
         <div className="stream-logo" style={{ backgroundImage: `url(${i.channel.logo})` }} />
         <div className="stream-name">
           {i.channel.display_name}
         </div>
         <div className="stream-viewers">
           <FontAwesomeIcon id="eye-icon" icon="eye" />
           {i.viewers}
         </div>
       </div>
     </div>
        )) : <h1>Loading Streams...</h1>;

const Article = ({ article }) => (
  <div className="news">
    <div className="news-img-cover" style={{ backgroundImage: `url(${article.media.image.original})` }} />
    {/* <div class="news-author front">
                {article.author}
            </div>
            <div class="news-date front">
                October 7 2018
            </div> */}
    <div className="news-title front">
      {article.shortTitle != '' ? article.shortTitle : article.title}
    </div>
  </div>
    );
const Articles = ({ articles, properties }) => {
    const indexOfLastArticle = properties.currentPage * properties.articlesPerPage;
    const indexOfFirstArticle = indexOfLastArticle - properties.articlesPerPage;
        const currentArticles = articles.slice(indexOfFirstArticle, indexOfLastArticle);
        const renderArticles = currentArticles.map((article, index) => (
          <Article key={index} article={article} />
        ));

      return renderArticles;
};

const PageNumbers = ({
articles, properties, pageNumbers, handleClick,
}) => {
    for (let i = 1; i <= Math.ceil(articles.length / properties.articlesPerPage); i++) {
        pageNumbers.push(i);
    }
    const renderPageNumbers = pageNumbers.map(number => (
      <li
        key={number}
        id={number}
        onClick={handleClick}
      />
      ));

    return renderPageNumbers;
};

class Discover extends React.Component {
    constructor() {
        super();
        this.state = {
            stream_list: null,
            articles: [],
            properties: {
                currentPage: 1,
                articlesPerPage: 3,
            },
        };
    }

    componentDidMount() {
      this.getStreams();
      this.getArticles();
    }

    getArticles = () => {
        fetch('https://api.lolesports.com/api/v1/articles?getRelated=false&language=en&size=20', {
            method: 'GET',
        })
        .then(res => res.json())
        .then((res) => {
            this.setState({
                articles: res.articles,
            });
        })
        .catch(err => new ErrorEvent(err));
    }

    getStreams = () => {
        fetch('/stream', {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.props.Auth.getToken()}`,
            },
        })
        .then(res => res.json())
        .then((res) => {
            this.setState({
                stream_list: res.data,
            });
        })
        .catch(err => console.log(err));
    }


    handlePagination = (event) => {
        this.setState({
            properties: {
                ...this.state.properties,
                currentPage: Number(event.target.id),
            },
        });
      }

    render() {
        const { stream_list, articles, properties } = this.state;
        const pageNumbers = [];
        const articlesLength = articles && articles.length ? articles.length : [];
        const articlesCopy = articles && articles.length ? [...articles] : [];
        return (
          <div className="section-selected-tab">
            <div className="esports-panel panel">
              <div className="panel-head">
                <h1>ESPORTS</h1>
                <div className="category-list">
                  <ul>
                    <li>Most Popular</li>
                    <li>League of Legends</li>
                    <li>CS:GO</li>
                    <li>Dota 2</li>
                    <li><input type="text" placeholder="search..." /></li>
                  </ul>
                </div>
                <div className="news-box">
                  <Articles articles={articlesCopy} properties={properties} />
                  <ul>
                    <PageNumbers handleClick={this.handlePagination} articles={articlesCopy} pageNumbers={pageNumbers} properties={properties} />
                  </ul>
                </div>
              </div>
            </div>
            <div className="match-panel panel" />
            <div className="stream-panel panel">
              <div className="panel-head">
                <h1>Popular Streams</h1>
              </div>
              <div className="streams-box">
                <Streams stream_list={stream_list} />
              </div>
            </div>
          </div>
        );
    }
}


export default Discover;
