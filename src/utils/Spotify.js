const clientID = '288bc1661aed4ae3a6bd5c2dd6f21fe1';
const redirectUri = 'https://soccmusic.surge.sh/';
let accessToken;

export const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }   
        // check for acccess token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

        if(accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            // clears the parameters, can grab new access token when it expires
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');        
            return accessToken;
        }   else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
            window.location = accessUrl; 
        }
    },

    search(term) {
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return [];
            }
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }))
        });
    },

    savePlaylist(name, trackUris) {
        if (!name || !trackUris || trackUris.length === 0) {
            return;
        };
        const userUrl = 'https://api.spotify.com/v1/me';
        const headers = {
          Authorization: `Bearer ${accessToken}`
        };
        let userId = undefined;
        let playlistId = undefined;
        fetch(userUrl, {
          headers: headers 
        })
        .then(response => response.json())
        .then(jsonResponse => userId = jsonResponse.id)
        .then(() => {
          const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
          fetch(createPlaylistUrl, {
              method: 'POST',
              headers: headers,
              body: JSON.stringify({
                name: name
              })
            })
            .then(response => response.json())
            .then(jsonResponse => playlistId = jsonResponse.id)
            .then(() => {
              const addPlaylistTracksUrl = `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`;
              fetch(addPlaylistTracksUrl, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                  uris: trackUris
                })
              });
            })
        })
    }
}
