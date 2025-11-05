import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Search, Film, Heart, X, AlertCircle } from 'lucide-react';
import MovieDetails from './moviedetails';
import { useSearchParams, useLocation } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filterLabel, setFilterLabel] = useState("");
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);
  
  const searchTimeoutRef = useRef(null);
  const abortControllerRef = useRef(null);

  const genreId = searchParams.get('genre');
  const keywordId = searchParams.get('keyword');
  const keywordName = searchParams.get('name');
  
  const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (movieId) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(movieId)
        ? prev.filter(id => id !== movieId)
        : [...prev, movieId];
      localStorage.setItem('movieFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const styles = {
    app: {
      minHeight: '100vh',
      backgroundColor: '#000',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      borderBottom: '1px solid #2d2d2d',
      padding: '1rem 1.5rem',
      position: 'sticky',
      top: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.95)',
      backdropFilter: 'blur(10px)',
      zIndex: 50
    },
    headerContent: {
      maxWidth: '1280px',
      margin: '0 auto',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      textDecoration: 'none',
      color: '#fff'
    },
    nav: {
      display: 'flex',
      gap: '2rem',
      flexWrap: 'wrap'
    },
    navLink: {
      color: '#fff',
      textDecoration: 'none',
      transition: 'color 0.3s',
      cursor: 'pointer',
      padding: '0.5rem 0'
    },
    hero: {
      padding: '5rem 1.5rem',
      textAlign: 'center'
    },
    heroContent: {
      maxWidth: '56rem',
      margin: '0 auto'
    },
    title: {
      fontSize: 'clamp(2rem, 5vw, 3.5rem)',
      fontWeight: 'bold',
      marginBottom: '1.5rem'
    },
    subtitle: {
      fontSize: 'clamp(1rem, 2vw, 1.25rem)',
      color: '#9ca3af',
      marginBottom: '2rem'
    },
    searchContainer: {
      display: 'flex',
      gap: '1rem',
      maxWidth: '42rem',
      margin: '0 auto',
      flexWrap: 'wrap'
    },
    searchWrapper: {
      flex: 1,
      position: 'relative',
      minWidth: '250px'
    },
    searchIcon: {
      position: 'absolute',
      left: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      color: '#6b7280',
      pointerEvents: 'none'
    },
    input: {
      width: '100%',
      padding: '1rem 3rem 1rem 3rem',
      backgroundColor: '#1f1f1f',
      border: '1px solid #2d2d2d',
      borderRadius: '0.5rem',
      color: '#fff',
      fontSize: '1rem',
      outline: 'none',
      transition: 'border-color 0.3s'
    },
    clearButton: {
      position: 'absolute',
      right: '1rem',
      top: '50%',
      transform: 'translateY(-50%)',
      backgroundColor: 'transparent',
      border: 'none',
      color: '#6b7280',
      cursor: 'pointer',
      padding: '0.25rem',
      display: 'flex',
      alignItems: 'center'
    },
    button: {
      padding: '1rem 2rem',
      backgroundColor: '#2563eb',
      border: 'none',
      borderRadius: '0.5rem',
      color: '#fff',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'background-color 0.3s',
      whiteSpace: 'nowrap'
    },
    section: {
      padding: '3rem 1.5rem'
    },
    sectionContent: {
      maxWidth: '1280px',
      margin: '0 auto'
    },
    sectionTitle: {
      fontSize: '1.875rem',
      fontWeight: 'bold',
      marginBottom: '2rem'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '1rem'
    },
    movieCard: {
      position: 'relative',
      cursor: 'pointer',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      transition: 'transform 0.3s, box-shadow 0.3s'
    },
    movieImage: {
      width: '100%',
      height: '20rem',
      objectFit: 'cover',
      transition: 'transform 0.3s'
    },
    heartIcon: {
      position: 'absolute',
      top: '0.5rem',
      right: '0.5rem',
      backgroundColor: 'rgba(31, 41, 55, 0.9)',
      padding: '0.5rem',
      borderRadius: '0.25rem',
      cursor: 'pointer',
      zIndex: 10,
      transition: 'background-color 0.3s'
    },
    movieInfo: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.8), transparent)',
      padding: '1rem'
    },
    movieTitle: {
      fontWeight: '600',
      fontSize: '0.875rem',
      marginBottom: '0.25rem',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    movieDetails: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '0.75rem',
      color: '#d1d5db'
    },
    genreCard: {
      position: 'relative',
      height: '12rem',
      borderRadius: '0.5rem',
      overflow: 'hidden',
      cursor: 'pointer',
      transition: 'transform 0.3s, box-shadow 0.3s'
    },
    genreBackground: {
      width: '100%',
      height: '100%',
      background: 'linear-gradient(135deg, #1e3a8a, #7c3aed)'
    },
    genreOverlay: {
      position: 'absolute',
      inset: 0,
      background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.3) 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background 0.3s'
    },
    genreName: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    },
    footer: {
      borderTop: '1px solid #2d2d2d',
      marginTop: '5rem',
      padding: '2rem 1.5rem',
      textAlign: 'center',
      color: '#9ca3af'
    },
    errorBanner: {
      backgroundColor: '#7f1d1d',
      border: '1px solid #991b1b',
      color: '#fecaca',
      padding: '1rem 1.5rem',
      borderRadius: '0.5rem',
      margin: '1rem auto',
      maxWidth: '1280px',
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem'
    },
    filterBanner: {
      backgroundColor: '#1f1f1f',
      padding: '0.75rem 2rem',
      borderRadius: '8px',
      margin: '1.5rem auto 1rem',
      maxWidth: '1280px'
    }
  };

  // Debounced fetch suggestions
  const fetchSuggestions = useCallback(async (query) => {
    if (!query.trim() || !TMDB_API_KEY) {
      setSuggestions([]);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`,
        { signal: abortControllerRef.current.signal }
      );
      
      if (!response.ok) throw new Error('Failed to fetch suggestions');
      
      const data = await response.json();
      const movieSuggestions = data.results.slice(0, 5).map(movie => ({
        type: 'movie',
        id: movie.id,
        name: movie.title,
        year: movie.release_date?.split('-')[0],
      }));

      const genreMatches = genres
        .filter(g => g.name.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5)
        .map(genre => ({
          type: 'genre',
          id: genre.id,
          name: genre.name,
        }));

      setSuggestions([...movieSuggestions, ...genreMatches]);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error fetching suggestions:', error);
      }
    }
  }, [TMDB_API_KEY, genres]);

  // Debounce search input
  const handleSearchInputChange = (value) => {
    setSearchQuery(value);
    setShowSuggestions(true);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchSuggestions(value);
    }, 300);
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchPopularMovies = async () => {
    try {
      console.log('🎬 Fetching popular movies...');
      
      // Add timeout for mobile networks
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout
      
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Movies loaded:', data.results?.length);
      
      setPopularMovies(data.results.slice(0, 12));
      setError(null);
    } catch (error) {
      console.error('❌ Error fetching popular movies:', error);
      
      if (error.name === 'AbortError') {
        setError('Request timeout. Please check your internet connection and try again.');
      } else {
        setError(`Failed to load movies: ${error.message}. Please refresh the page.`);
      }
    }
  };

  const fetchGenres = async () => {
    try {
      console.log('🎭 Fetching genres...');
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`,
        { signal: controller.signal }
      );
      
      clearTimeout(timeoutId);
      
      console.log('📡 Genre response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Genres loaded:', data.genres?.length);
      
      setGenres(data.genres.slice(0, 12));
      setError(null);
    } catch (error) {
      console.error('❌ Error fetching genres:', error);
      
      if (error.name === 'AbortError') {
        setError('Request timeout. Please check your internet connection.');
      } else {
        setError(`Failed to load genres: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    console.log('🔑 API Key Check:', TMDB_API_KEY ? 'Present' : 'Missing');
    console.log('📱 User Agent:', navigator.userAgent);
    
    if (TMDB_API_KEY && TMDB_API_KEY !== 'YOUR_API_KEY_HERE') {
      fetchPopularMovies();
      fetchGenres();
    } else {
      console.error('❌ API Key not configured properly');
      setError('TMDB API key is not configured. Please add your API key to the .env file.');
    }
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() && TMDB_API_KEY) {
      setIsSearching(true);
      setError(null);
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(searchQuery)}&page=1`
        );
        if (!response.ok) throw new Error('Search failed');
        const data = await response.json();
        setSearchResults(data.results.slice(0, 12));
        setShowSuggestions(false);
      } catch (error) {
        console.error('Error searching movies:', error);
        setError('Search failed. Please try again.');
      }
      setIsSearching(false);
    }
  };

  useEffect(() => {
    const fetchByGenreOrKeyword = async () => {
      if (!TMDB_API_KEY) return;

      if (genreId) {
        setIsSearching(true);
        setError(null);
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_genres=${genreId}&page=1`
          );
          if (!response.ok) throw new Error('Failed to fetch movies by genre');
          const data = await response.json();
          setSearchResults(data.results.slice(0, 12));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.error('Error fetching movies by genre:', error);
          setError('Failed to load movies for this genre.');
        }
        setIsSearching(false);
      } else if (keywordId) {
        setIsSearching(true);
        setError(null);
        try {
          const response = await fetch(
            `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_API_KEY}&language=en-US&with_keywords=${keywordId}&page=1`
          );
          if (!response.ok) throw new Error('Failed to fetch movies by keyword');
          const data = await response.json();
          setSearchResults(data.results.slice(0, 12));
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.error('Error fetching movies by keyword:', error);
          setError('Failed to load movies for this keyword.');
        }
        setIsSearching(false);
      }
    };

    fetchByGenreOrKeyword();
  }, [genreId, keywordId, TMDB_API_KEY]);
  
  useEffect(() => {
    const updateLabel = async () => {
      if (genreId && genres.length > 0) {
        const selectedGenre = genres.find(g => g.id === parseInt(genreId));
        if (selectedGenre) {
          setFilterLabel(selectedGenre.name);
        } else {
          try {
            const res = await fetch(
              `https://api.themoviedb.org/3/genre/movie/list?api_key=${TMDB_API_KEY}&language=en-US`
            );
            const data = await res.json();
            const found = data.genres.find(g => g.id === parseInt(genreId));
            setFilterLabel(found ? found.name : "");
          } catch (error) {
            console.error("Error fetching genre name:", error);
            setFilterLabel("");
          }
        }
      } else if (keywordId) {
        try {
          const res = await fetch(
            `https://api.themoviedb.org/3/keyword/${keywordId}?api_key=${TMDB_API_KEY}`
          );
          const data = await res.json();
          setFilterLabel(data.name || keywordId);
        } catch (err) {
          console.error("Error fetching keyword name:", err);
          setFilterLabel(keywordId);
        }
      } else {
        setFilterLabel("");
      }
    };

    updateLabel();
  }, [genreId, keywordId, genres, TMDB_API_KEY]);

  const handleGenreClick = (genreId) => {
    navigate(`/?genre=${genreId}`);
  };

  const MovieCard = ({ movie }) => {
    const isFavorite = favorites.includes(movie.id);
    
    return (
      <div 
        style={styles.movieCard}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
        }}
        onClick={() => navigate(`/movie/${movie.id}`)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${movie.title}`}
      >
        <img 
          src={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image'}
          alt={movie.title} 
          style={styles.movieImage}
          loading="lazy"
        />
        <div 
          style={{
            ...styles.heartIcon,
            backgroundColor: isFavorite ? 'rgba(239, 68, 68, 0.9)' : 'rgba(31, 41, 55, 0.9)'
          }}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(movie.id);
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = isFavorite ? '#dc2626' : '#374151'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = isFavorite ? 'rgba(239, 68, 68, 0.9)' : 'rgba(31, 41, 55, 0.9)'}
          role="button"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart size={20} color={isFavorite ? '#fff' : '#d1d5db'} fill={isFavorite ? '#fff' : 'none'} />
        </div>
        <div style={styles.movieInfo}>
          <h3 style={styles.movieTitle}>{movie.title}</h3>
          <div style={styles.movieDetails}>
            <span>{movie.release_date?.split('-')[0] || 'N/A'}</span>
            {movie.vote_average > 0 && (
              <span style={{color: '#fbbf24'}}>★ {movie.vote_average.toFixed(1)}</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Genre images mapping
  const genreImages = {
    28: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80', // Action
    12: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Adventure
    16: 'https://images.unsplash.com/photo-1578632292335-df3abbb0d586?w=800&q=80', // Animation
    35: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800&q=80', // Comedy
    80: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=800&q=80', // Crime
    99: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80', // Documentary
    18: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800&q=80', // Drama
    10751: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80', // Family
    14: 'https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&q=80', // Fantasy
    36: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80', // History
    27: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&q=80', // Horror
    10402: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&q=80', // Music
    9648: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', // Mystery
    10749: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800&q=80', // Romance
    878: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80', // Science Fiction
    10770: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80', // TV Movie
    53: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80', // Thriller
    10752: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80', // War
    37: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&q=80', // Western
  };

  const GenreCard = ({ genre }) => {
    const genreImage = genreImages[genre.id] || 'https://images.unsplash.com/photo-1574267432644-f74723892c49?w=800&q=80';
    
    return (
      <div 
        style={styles.genreCard}
        onClick={() => handleGenreClick(genre.id)}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
          e.currentTarget.querySelector('img').style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.querySelector('img').style.transform = 'scale(1)';
        }}
        role="button"
        tabIndex={0}
        aria-label={`Browse ${genre.name} movies`}
      >
        <img 
          src={genreImage}
          alt={genre.name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
          }}
          loading="lazy"
        />
        <div style={styles.genreOverlay}>
          <h3 style={styles.genreName}>{genre.name}</h3>
        </div>
      </div>
    );
  };

  return (
    <div style={styles.app}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <Link 
            to="/" 
            style={styles.logo} 
            aria-label="MovieMatch Home"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setSearchResults([]);
              setSearchQuery('');
            }}
          >
            <Film size={32} color="#3b82f6" />
            <h1>MovieMatch</h1>
          </Link>
          <nav style={styles.nav} role="navigation">
            <Link 
              to="/" 
              style={styles.navLink}
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setSearchResults([]);
                setSearchQuery('');
              }}
            >
              Home
            </Link>
            <a href="#genres" style={styles.navLink}>Genres</a>
            <a href="#about" style={styles.navLink}>About</a>
            <a href="#contact" style={styles.navLink}>Contact</a>
          </nav>
        </div>
      </header>

      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h2 style={styles.title}>Find Movies You'll Love</h2>
          <p style={styles.subtitle}>
            Search by movie name or genre — discover your next favorite film!
          </p>

          {error && (
            <div style={styles.errorBanner} role="alert">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSearch} style={styles.searchContainer}>
            <div style={styles.searchWrapper}>
              <div style={styles.searchIcon}>
                <Search size={20} />
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Search by movie or genre..."
                style={styles.input}
                aria-label="Search movies"
              />

              {searchQuery && (
                <button
                  type="button"
                  style={styles.clearButton}
                  onClick={() => {
                    setSearchQuery('');
                    setSuggestions([]);
                  }}
                  aria-label="Clear search"
                >
                  <X size={20} />
                </button>
              )}

              {showSuggestions && suggestions.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: '#1f1f1f',
                    border: '1px solid #2d2d2d',
                    borderRadius: '0.5rem',
                    marginTop: '0.25rem',
                    zIndex: 10,
                    maxHeight: '250px',
                    overflowY: 'auto',
                  }}
                  role="listbox"
                >
                  {suggestions.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      onMouseDown={() => {
                        setSearchQuery(item.name);
                        setShowSuggestions(false);
                        if (item.type === 'movie') navigate(`/movie/${item.id}`);
                        else navigate(`/?genre=${item.id}`);
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        color: '#fff',
                        borderBottom: '1px solid #2d2d2d',
                        fontSize: '0.95rem',
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d2d2d'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      role="option"
                    >
                      <span style={{ fontSize: '1.1rem' }}>
                        {item.type === 'movie' ? '🎬' : '🏷️'}
                      </span>
                      <span>
                        {item.name}
                        {item.type === 'movie' && item.year ? ` (${item.year})` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isSearching}
              style={{ ...styles.button, opacity: isSearching ? 0.5 : 1 }}
              aria-label="Search movies"
            >
              {isSearching ? 'Searching...' : 'Find Movies'}
            </button>
          </form>
        </div>
      </section>

      {filterLabel && (
        <div style={styles.filterBanner}>
          <h2 style={{
            textAlign: 'left',
            color: '#fff',
            fontSize: '1.5rem',
            fontWeight: '600',
            margin: 0,
          }}>
            🎬 Results for: <span style={{ color: '#60a5fa' }}>{filterLabel}</span>
          </h2>
        </div>
      )}

      {searchResults.length > 0 && (
        <section style={styles.section}>
          <div style={styles.sectionContent}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', alignItems: 'center'}}>
              <h2 style={styles.sectionTitle}>Search Results</h2>
              <button
                onClick={() => {
                  setSearchResults([]);
                  navigate('/');
                }}
                style={{
                  ...styles.button,
                  backgroundColor: 'transparent',
                  border: '1px solid #2d2d2d'
                }}
              >
                Clear Results
              </button>
            </div>
            <div style={styles.grid}>
              {searchResults.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={styles.section}>
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Popular Movies</h2>
          {popularMovies.length > 0 ? (
            <div style={styles.grid}>
              {popularMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          ) : (
            <div style={{textAlign: 'center', color: '#9ca3af', padding: '3rem 0'}}>
              {error ? 'Unable to load movies' : 'Loading movies...'}
            </div>
          )}
        </div>
      </section>

      <section style={styles.section} id="genres">
        <div style={styles.sectionContent}>
          <h2 style={styles.sectionTitle}>Movies by Genre</h2>
          {genres.length > 0 ? (
            <div style={styles.grid}>
              {genres.map(genre => (
                <GenreCard key={genre.id} genre={genre} />
              ))}
            </div>
          ) : (
            <div style={{textAlign: 'center', color: '#9ca3af', padding: '3rem 0'}}>
              {error ? 'Unable to load genres' : 'Loading genres...'}
            </div>
          )}
        </div>
      </section>

      <footer style={styles.footer}>
        <p style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap'}}>
          © 2025 MovieMatch — Made with <Heart size={16} color="#ef4444" fill="#ef4444" /> for movie lovers
        </p>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/movie/:id" element={<MovieDetails />} />
    </Routes>
  );
};

export default App;