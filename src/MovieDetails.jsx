import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Play, Plus, Heart, Star, Clock, Calendar, Globe, DollarSign, Users, TrendingUp, AlertCircle, X } from 'lucide-react';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [keywords, setKeywords] = useState([]);
  const [videos, setVideos] = useState([]);
  const [cast, setCast] = useState([]);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/original';
  const TMDB_POSTER_BASE = 'https://image.tmdb.org/t/p/w300';

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    backButton: {
      position: 'fixed',
      top: '2rem',
      left: '2rem',
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '0.75rem 1.5rem',
      borderRadius: '0.5rem',
      color: '#fff',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.3s',
      textDecoration: 'none'
    },
    heroSection: {
      position: 'relative',
      height: '80vh',
      minHeight: '600px'
    },
    backdrop: {
      position: 'absolute',
      inset: 0,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    },
    gradient: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)'
    },
    heroContent: {
      position: 'relative',
      height: '100%',
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'flex-end',
      paddingBottom: '4rem',
      flexWrap: 'wrap',
      gap: '2rem'
    },
    posterContainer: {
      flexShrink: 0
    },
    poster: {
      width: '220px',
      height: '330px',
      objectFit: 'cover',
      borderRadius: '0.5rem',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
    },
    infoContainer: {
      flex: 1,
      maxWidth: '800px',
      minWidth: '250px'
    },
    title: {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: 'bold',
      marginBottom: '1rem',
      textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
    },
    metaRow: {
      display: 'flex',
      alignItems: 'center',
      gap: '1.5rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap'
    },
    ratingContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1.5rem',
      fontWeight: 'bold'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#d1d5db',
      fontSize: '1rem'
    },
    genreList: {
      display: 'flex',
      gap: '0.5rem',
      marginBottom: '1.5rem',
      flexWrap: 'wrap'
    },
    genreBadge: {
      padding: '0.4rem 1rem',
      backgroundColor: 'rgba(37, 99, 235, 0.2)',
      border: '1px solid rgba(37, 99, 235, 0.5)',
      borderRadius: '1.5rem',
      fontSize: '0.9rem',
      color: '#93c5fd',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    overview: {
      fontSize: '1.1rem',
      lineHeight: '1.8',
      color: '#e5e7eb',
      marginBottom: '2rem',
      maxWidth: '700px',
      textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      flexWrap: 'wrap'
    },
    primaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 2rem',
      backgroundColor: '#fff',
      color: '#000',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'opacity 0.3s'
    },
    secondaryButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '1rem 2rem',
      backgroundColor: 'rgba(109, 109, 109, 0.7)',
      color: '#fff',
      border: 'none',
      borderRadius: '0.375rem',
      fontSize: '1.1rem',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    },
    iconButton: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      border: '2px solid #fff',
      backgroundColor: 'rgba(42, 42, 42, 0.7)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    detailsSection: {
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '3rem 2rem'
    },
    sectionTitle: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginBottom: '1.5rem',
      color: '#fff'
    },
    keywordsContainer: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '0.75rem',
      marginTop: '2rem'
    },
    keywordBadge: {
      padding: '0.5rem 1rem',
      backgroundColor: '#1f1f1f',
      border: '1px solid #2d2d2d',
      borderRadius: '0.375rem',
      fontSize: '0.9rem',
      color: '#9ca3af',
      cursor: 'pointer',
      transition: 'all 0.3s'
    },
    infoGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginTop: '2rem'
    },
    infoCard: {
      backgroundColor: '#1f1f1f',
      padding: '1.5rem',
      borderRadius: '0.5rem',
      border: '1px solid #2d2d2d'
    },
    infoLabel: {
      color: '#9ca3af',
      fontSize: '0.875rem',
      marginBottom: '0.5rem',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    infoValue: {
      color: '#fff',
      fontSize: '1.1rem',
      fontWeight: '500'
    },
    loading: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      color: '#9ca3af'
    },
    trailerModal: {
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    },
    trailerContainer: {
      position: 'relative',
      width: '100%',
      maxWidth: '1200px',
      aspectRatio: '16 / 9'
    },
    closeButton: {
      position: 'absolute',
      top: '-3rem',
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      color: '#fff',
      padding: '0.75rem',
      borderRadius: '0.5rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'background-color 0.3s'
    },
    castGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    castCard: {
      textAlign: 'center'
    },
    castImage: {
      width: '100%',
      aspectRatio: '2/3',
      objectFit: 'cover',
      borderRadius: '0.5rem',
      marginBottom: '0.5rem'
    },
    castName: {
      fontSize: '0.875rem',
      fontWeight: '600',
      marginBottom: '0.25rem'
    },
    castCharacter: {
      fontSize: '0.75rem',
      color: '#9ca3af'
    },
    similarGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '1rem',
      marginTop: '1.5rem'
    },
    similarCard: {
      cursor: 'pointer',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      transition: 'transform 0.3s'
    },
    similarImage: {
      width: '100%',
      aspectRatio: '2/3',
      objectFit: 'cover'
    },
    errorBanner: {
      backgroundColor: '#7f1d1d',
      border: '1px solid #991b1b',
      color: '#fecaca',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      margin: '2rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!TMDB_API_KEY || TMDB_API_KEY === 'YOUR_API_KEY_HERE') {
        setError('TMDB API key is not configured.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Fetch movie details
        const movieResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${TMDB_API_KEY}&language=en-US`
        );
        if (!movieResponse.ok) throw new Error('Failed to fetch movie details');
        const movieData = await movieResponse.json();
        setMovie(movieData);

        // Fetch keywords - handle empty response
        try {
          const keywordsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/keywords?api_key=${TMDB_API_KEY}`
          );
          const keywordsData = await keywordsResponse.json();
          setKeywords(keywordsData.keywords || []);
        } catch (err) {
          console.warn('Keywords not available:', err);
          setKeywords([]);
        }

        // Fetch videos (trailers) - handle empty response
        try {
          const videosResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${TMDB_API_KEY}&language=en-US`
          );
          const videosData = await videosResponse.json();
          setVideos(videosData.results || []);
        } catch (err) {
          console.warn('Videos not available:', err);
          setVideos([]);
        }

        // Fetch cast - handle empty response
        try {
          const creditsResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${TMDB_API_KEY}`
          );
          const creditsData = await creditsResponse.json();
          setCast(creditsData.cast?.slice(0, 12) || []);
        } catch (err) {
          console.warn('Cast not available:', err);
          setCast([]);
        }

        // Fetch similar movies - handle empty response
        try {
          const similarResponse = await fetch(
            `https://api.themoviedb.org/3/movie/${id}/similar?api_key=${TMDB_API_KEY}&language=en-US&page=1`
          );
          const similarData = await similarResponse.json();
          const similarResults = similarData.results || [];
          
          // If no similar movies found, try recommendations endpoint
          if (similarResults.length === 0) {
            const recommendationsResponse = await fetch(
              `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${TMDB_API_KEY}&language=en-US&page=1`
            );
            const recommendationsData = await recommendationsResponse.json();
            setSimilarMovies(recommendationsData.results?.slice(0, 12) || []);
          } else {
            setSimilarMovies(similarResults.slice(0, 12));
          }
        } catch (err) {
          console.warn('Similar movies not available:', err);
          setSimilarMovies([]);
        }

      } catch (error) {
        console.error('Error fetching movie details:', error);
        setError('Failed to load movie details. Please try again later.');
      }
      setLoading(false);
    };

    fetchMovieDetails();
  }, [id, TMDB_API_KEY]);

  // Load favorites and watchlist from localStorage
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    const watchlist = JSON.parse(localStorage.getItem('movieWatchlist') || '[]');
    setIsFavorite(favorites.includes(parseInt(id)));
    setIsInWatchlist(watchlist.includes(parseInt(id)));
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
    const movieId = parseInt(id);
    
    if (favorites.includes(movieId)) {
      const newFavorites = favorites.filter(fId => fId !== movieId);
      localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
      setIsFavorite(false);
    } else {
      localStorage.setItem('movieFavorites', JSON.stringify([...favorites, movieId]));
      setIsFavorite(true);
    }
  };

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem('movieWatchlist') || '[]');
    const movieId = parseInt(id);
    
    if (watchlist.includes(movieId)) {
      const newWatchlist = watchlist.filter(wId => wId !== movieId);
      localStorage.setItem('movieWatchlist', JSON.stringify(newWatchlist));
      setIsInWatchlist(false);
    } else {
      localStorage.setItem('movieWatchlist', JSON.stringify([...watchlist, movieId]));
      setIsInWatchlist(true);
    }
  };

  const handleKeywordClick = (keywordId, keywordName) => {
    navigate(`/?keyword=${keywordId}&name=${keywordName}`);
  };

  const handleGenreClick = (genreId) => {
    navigate(`/?genre=${genreId}`);
  };

  const playTrailer = () => {
    const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos[0];
    if (trailer) {
      setShowTrailer(true);
    } else {
      alert('No trailer available for this movie.');
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading movie details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <Link to="/" style={styles.backButton}>
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </Link>
        <div style={styles.errorBanner}>
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Movie not found</div>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? `${TMDB_IMAGE_BASE}${movie.backdrop_path}` 
    : 'https://via.placeholder.com/1920x1080?text=No+Backdrop';
  
  const posterUrl = movie.poster_path 
    ? `${TMDB_POSTER_BASE}${movie.poster_path}` 
    : 'https://via.placeholder.com/300x450?text=No+Poster';

  const runtime = movie.runtime ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : 'N/A';
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
  const trailer = videos.find(v => v.type === 'Trailer' && v.site === 'YouTube') || videos[0];

  return (
    <div style={styles.container}>
      {/* Trailer Modal */}
      {showTrailer && trailer && (
        <div style={styles.trailerModal} onClick={() => setShowTrailer(false)}>
          <div style={styles.trailerContainer} onClick={(e) => e.stopPropagation()}>
            <button 
              style={styles.closeButton}
              onClick={() => setShowTrailer(false)}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              aria-label="Close trailer"
            >
              <X size={20} />
              <span>Close</span>
            </button>
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={trailer.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '0.5rem' }}
            />
          </div>
        </div>
      )}

      {/* Back Button */}
      <Link 
        to="/" 
        style={styles.backButton}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.9)';
          e.currentTarget.style.transform = 'translateX(-4px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          e.currentTarget.style.transform = 'translateX(0)';
        }}
      >
        <ArrowLeft size={20} />
        <span>Back to Home</span>
      </Link>

      {/* Hero Section */}
      <section style={styles.heroSection}>
        <div 
          style={{
            ...styles.backdrop,
            backgroundImage: `url(${backdropUrl})`
          }}
        />
        <div style={styles.gradient} />
        
        <div style={styles.heroContent}>
          <div style={styles.posterContainer}>
            <img src={posterUrl} alt={movie.title} style={styles.poster} />
          </div>

          <div style={styles.infoContainer}>
            <h1 style={styles.title}>{movie.title}</h1>

            <div style={styles.metaRow}>
              <div style={styles.ratingContainer}>
                <Star size={28} color="#fbbf24" fill="#fbbf24" />
                <span>{rating}</span>
                <span style={{fontSize: '1rem', color: '#9ca3af', fontWeight: 'normal'}}>/10</span>
              </div>

              <div style={styles.metaItem}>
                <Clock size={18} />
                <span>{runtime}</span>
              </div>

              <div style={styles.metaItem}>
                <Calendar size={18} />
                <span>{releaseYear}</span>
              </div>

              {movie.original_language && (
                <div style={styles.metaItem}>
                  <Globe size={18} />
                  <span>{movie.original_language.toUpperCase()}</span>
                </div>
              )}
            </div>

            <div style={styles.genreList}>
              {movie.genres && movie.genres.map(genre => (
                <div 
                  key={genre.id} 
                  style={styles.genreBadge}
                  onClick={() => handleGenreClick(genre.id)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.3)';
                    e.target.style.borderColor = 'rgba(37, 99, 235, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = 'rgba(37, 99, 235, 0.2)';
                    e.target.style.borderColor = 'rgba(37, 99, 235, 0.5)';
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {genre.name}
                </div>
              ))}
            </div>

            {movie.tagline && (
              <p style={{
                fontSize: '1.2rem',
                fontStyle: 'italic',
                color: '#d1d5db',
                marginBottom: '1rem',
                textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
              }}>
                "{movie.tagline}"
              </p>
            )}

            <p style={styles.overview}>{movie.overview}</p>

            <div style={styles.buttonGroup}>
              {trailer && (
                <button 
                  style={styles.primaryButton}
                  onClick={playTrailer}
                  onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.target.style.opacity = '1'}
                >
                  <Play size={24} fill="#000" />
                  <span>Play Trailer</span>
                </button>
              )}
              
              <button 
                style={{
                  ...styles.secondaryButton,
                  backgroundColor: isInWatchlist ? 'rgba(37, 99, 235, 0.7)' : 'rgba(109, 109, 109, 0.7)'
                }}
                onClick={toggleWatchlist}
                onMouseEnter={(e) => e.target.style.opacity = '0.9'}
                onMouseLeave={(e) => e.target.style.opacity = '1'}
                aria-label={isInWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <Plus size={24} />
                <span>{isInWatchlist ? 'In Watchlist' : 'My List'}</span>
              </button>

              <button 
                style={{
                  ...styles.iconButton,
                  backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.7)' : 'rgba(42, 42, 42, 0.7)',
                  borderColor: isFavorite ? '#ef4444' : '#fff'
                }}
                onClick={toggleFavorite}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart size={24} color={isFavorite ? '#fff' : '#fff'} fill={isFavorite ? '#fff' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Details Section */}
      <section style={styles.detailsSection}>
        {/* Cast */}
        {cast.length > 0 && (
          <>
            <h2 style={styles.sectionTitle}>Cast</h2>
            <div style={styles.castGrid}>
              {cast.map(person => (
                <div key={person.id} style={styles.castCard}>
                  <img 
                    src={person.profile_path 
                      ? `https://image.tmdb.org/t/p/w200${person.profile_path}` 
                      : 'https://via.placeholder.com/200x300?text=No+Image'}
                    alt={person.name}
                    style={styles.castImage}
                    loading="lazy"
                  />
                  <div style={styles.castName}>{person.name}</div>
                  <div style={styles.castCharacter}>{person.character}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Movie Information */}
        <h2 style={{...styles.sectionTitle, marginTop: '3rem'}}>Movie Information</h2>
        <div style={styles.infoGrid}>
          {movie.budget > 0 && (
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Budget</div>
              <div style={styles.infoValue}>
                ${(movie.budget / 1000000).toFixed(1)}M
              </div>
            </div>
          )}

          {movie.revenue > 0 && (
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Revenue</div>
              <div style={styles.infoValue}>
                ${(movie.revenue / 1000000).toFixed(1)}M
              </div>
            </div>
          )}

          {movie.status && (
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Status</div>
              <div style={styles.infoValue}>{movie.status}</div>
            </div>
          )}

          {movie.production_companies && movie.production_companies.length > 0 && (
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Production</div>
              <div style={styles.infoValue}>
                {movie.production_companies[0].name}
              </div>
            </div>
          )}

          {movie.vote_count && (
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Votes</div>
              <div style={styles.infoValue}>
                {movie.vote_count.toLocaleString()}
              </div>
            </div>
          )}

          {movie.popularity && (
            <div style={styles.infoCard}>
              <div style={styles.infoLabel}>Popularity</div>
              <div style={styles.infoValue}>
                {movie.popularity.toFixed(0)}
              </div>
            </div>
          )}
        </div>

        {/* Keywords */}
        {keywords.length > 0 ? (
          <>
            <h2 style={{...styles.sectionTitle, marginTop: '3rem'}}>Themes & Keywords</h2>
            <div style={styles.keywordsContainer}>
              {keywords.map(keyword => (
                <div
                  key={keyword.id}
                  style={styles.keywordBadge}
                  onClick={() => handleKeywordClick(keyword.id, keyword.name)}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#2d2d2d';
                    e.target.style.borderColor = '#3d3d3d';
                    e.target.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#1f1f1f';
                    e.target.style.borderColor = '#2d2d2d';
                    e.target.style.color = '#9ca3af';
                  }}
                  role="button"
                  tabIndex={0}
                >
                  {keyword.name}
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{marginTop: '3rem'}}>
            <h2 style={styles.sectionTitle}>Themes & Keywords</h2>
            <p style={{color: '#6b7280', fontSize: '1rem', fontStyle: 'italic'}}>
              No keywords available for this movie.
            </p>
          </div>
        )}

        {/* Similar Movies */}
        {similarMovies.length > 0 ? (
          <>
            <h2 style={{...styles.sectionTitle, marginTop: '3rem'}}>Similar Movies</h2>
            <div style={styles.similarGrid}>
              {similarMovies.map(similarMovie => (
                <div
                  key={similarMovie.id}
                  style={styles.similarCard}
                  onClick={() => navigate(`/movie/${similarMovie.id}`)}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  role="button"
                  tabIndex={0}
                >
                  <img
                    src={similarMovie.poster_path 
                      ? `${TMDB_POSTER_BASE}${similarMovie.poster_path}` 
                      : 'https://via.placeholder.com/300x450?text=No+Image'}
                    alt={similarMovie.title}
                    style={styles.similarImage}
                    loading="lazy"
                  />
                  <div style={{
                    padding: '0.5rem',
                    backgroundColor: '#1f1f1f'
                  }}>
                    <div style={{
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {similarMovie.title}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#9ca3af',
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginTop: '0.25rem'
                    }}>
                      <span>{similarMovie.release_date?.split('-')[0] || 'N/A'}</span>
                      {similarMovie.vote_average > 0 && (
                        <span style={{color: '#fbbf24'}}>★ {similarMovie.vote_average.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{marginTop: '3rem'}}>
            <h2 style={styles.sectionTitle}>Similar Movies</h2>
            <p style={{color: '#6b7280', fontSize: '1rem', fontStyle: 'italic'}}>
              No similar movies found. Try browsing by genre instead!
            </p>
          </div>
        )}

        {/* Production Countries */}
        {movie.production_countries && movie.production_countries.length > 0 && (
          <div style={{marginTop: '3rem'}}>
            <h2 style={styles.sectionTitle}>Production Countries</h2>
            <p style={{color: '#d1d5db', fontSize: '1.1rem'}}>
              {movie.production_countries.map(c => c.name).join(', ')}
            </p>
          </div>
        )}

        {/* Spoken Languages */}
        {movie.spoken_languages && movie.spoken_languages.length > 0 && (
          <div style={{marginTop: '2rem'}}>
            <h2 style={styles.sectionTitle}>Languages</h2>
            <p style={{color: '#d1d5db', fontSize: '1.1rem'}}>
              {movie.spoken_languages.map(l => l.english_name).join(', ')}
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

export default MovieDetails;