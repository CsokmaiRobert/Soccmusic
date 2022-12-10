import './App.css';
import React from 'react';

import { SearchBar } from '../SearchBar/SearchBar';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';

import { Spotify } from '../../utils/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

  addTrack(track) {
    let tracks = this.state.playlistTracks;
    if (tracks.find(savedTrack =>  savedTrack.id === track.id)) {
      return;
    }
    tracks.push(track);
    this.setState({playlistTracks: tracks});
  }

  removeTrack(track) {
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
  }

  updatePlaylistName(name) {
    this.setState({playlistName: name});
  }

  savePlaylist() {
    if (this.state.playlistTracks.length > 0) {
      const trackUris = this.state.playlistTracks.map(track => track.uri);
      Spotify.savePlaylist(this.state.playlistName, trackUris);
      this.setState({
        searchResults: [],
        playlistTracks: []
      });
      this.updatePlaylistName('My Playlist');
      alert('Your playlist is ready on your Spotify platform');
    }
  }

  search(term) {
    Spotify.search(term).then(searchResults => {
      this.setState({ searchResults: searchResults })
    })
  }

  render() {
    return (
      <div>
        <h1>Socc<span className="highlight">m</span>usic</h1>
        <div className="App">
          <SearchBar onSearch={this.search}
                     />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults}
                         onAdd={this.addTrack} />

            <Playlist playlistName={this.state.playlistName} 
                    playlistTracks={this.state.playlistTracks} 
                    onRemove={this.removeTrack}
                    onNameChange={this.updatePlaylistName} 
                    onSave={this.savePlaylist} />
          </div>
        </div>
        <div className="Footer">
          <h3>This website was made by <a href='https://soccmai.github.io'>Csokmai Robert-Sebastian</a></h3>
        </div>
      </div>
    )
  }
}

export default App;
