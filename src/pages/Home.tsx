import { useEffect, useState, useRef, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { apiService } from '../api/api';
import PostCard from '../components/PostCard';
import { useAuth } from '../hooks/useAuth';
import type { Post, Tag, User } from '../types';

const POSTS_POR_TANDA = 10;

export default function Home() {
  const { user, refreshUser } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const activeTag = searchParams.get('tag') || '';

  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [siguiendoLoading, setSiguiendoLoading] = useState<string | null>(null);

  // Cuántos posts mostramos en pantalla en este momento
  const [visibles, setVisibles] = useState(POSTS_POR_TANDA);

  // Referencia al elemento centinela (el div invisible al final de la lista)
  const centinelaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    Promise.all([apiService.getPosts(), apiService.getTags(), apiService.getUsers()])
      .then(([postsData, tagsData, usersData]) => {
        setPosts(postsData);
        setTags(tagsData);
        setUsuarios(usersData);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  // Cada vez que cambia el filtro o la búsqueda, reseteamos los visibles
  // para que el usuario arranque desde arriba con la nueva lista
  useEffect(() => {
    setVisibles(POSTS_POR_TANDA);
  }, [searchQuery, activeTag]);

  const usuariosSugeridos = usuarios.filter(u => {
    if (!user) return false;
    if (u._id === user._id) return false;
    return !user.following.some(f => (typeof f === 'string' ? f : f._id) === u._id);
  });

  const handleFollowSugerido = async (targetNick: string) => {
    if (!user) return;
    setSiguiendoLoading(targetNick);
    try {
      await apiService.followUser(user.nickName, targetNick);
      await refreshUser();
    } catch (err) {
      console.error('Error al seguir:', err);
    } finally {
      setSiguiendoLoading(null);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchQuery ? post.description?.toLowerCase().includes(searchQuery.toLowerCase()) : true;
    const matchesTag = activeTag ? post.tags?.some(t => t._id === activeTag) : true;
    return matchesSearch && matchesTag;
  });

  // Los posts que realmente se renderizan: solo los primeros `visibles`
  const postsMostrados = filteredPosts.slice(0, visibles);
  const hayMas = visibles < filteredPosts.length;

  // Función que suma una tanda más cuando el centinela entra en pantalla
  const cargarMas = useCallback(() => {
    setVisibles(prev => prev + POSTS_POR_TANDA);
  }, []);

  // IntersectionObserver: observa el centinela y llama a cargarMas cuando es visible
  useEffect(() => {
    const centinela = centinelaRef.current;
    if (!centinela) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // entries[0].isIntersecting es true cuando el centinela entra en la pantalla
        if (entries[0].isIntersecting && hayMas) {
          cargarMas();
        }
      },
      {
        // El observer se dispara cuando el centinela es al menos 10% visible
        threshold: 1,
      }
    );

    observer.observe(centinela);

    // Limpieza: cuando el componente se desmonta o el efecto se re-ejecuta,
    // dejamos de observar para no tener memory leaks
    return () => observer.disconnect();
  }, [hayMas, cargarMas]);

  return (
    <div className="container py-4" style={{ maxWidth: '1050px' }}>
      <div className="row g-3">

        {/* Columna Izquierda: Los Posts */}
        <div className="col-lg-8">
          {searchQuery && (
            <div className="mb-3 small" style={{ color: 'var(--reddit-muted)' }}>
              Resultados de búsqueda para <span className="fw-bold" style={{ color: 'var(--reddit-text)' }}>"{searchQuery}"</span>
            </div>
          )}

          {loading ? (
            <div className="text-center my-5"><div className="spinner-border text-warning" /></div>
          ) : filteredPosts.length === 0 ? (
            <div className="reddit-card p-5 text-center" style={{ color: 'var(--reddit-muted)' }}>
              <h6>No hay nada por acá</h6>
              <p className="small mb-0">Probá buscando otra palabra o etiqueta.</p>
            </div>
          ) : (
            <>
              {postsMostrados.map(post => <PostCard key={post._id} post={post} />)}

              {/* Centinela: elemento invisible que el IntersectionObserver vigila.
                  Cuando entra en pantalla, cargamos más posts. */}
              <div ref={centinelaRef} className="text-center py-3">
                {hayMas && (
                  <div className="spinner-border spinner-border-sm" style={{ color: 'var(--reddit-orange)' }} />
                )}
                {!hayMas && filteredPosts.length > POSTS_POR_TANDA && (
                  <p className="small mb-0" style={{ color: 'var(--reddit-muted)' }}>
                    Ya viste todo 👀
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Columna Derecha: Sidebar */}
        <div className="col-lg-4 d-none d-lg-block">
          <div className="reddit-card overflow-hidden mb-3">
            <div className="p-3 text-white fw-bold" style={{ backgroundColor: 'var(--reddit-orange)', fontSize: '14px' }}>
              Acerca de la Comunidad
            </div>
            <div className="p-3">
              <p className="small m-0 mb-3" style={{ color: 'var(--reddit-text)' }}>
                Bienvenidos a la red social oficial de los estudiantes de la UNAHUR. Espacio libre para debatir, compartir y crear hilos.
              </p>
              <div className="border-top pt-3 d-flex flex-column gap-2">
                <Link to="/create-post" className="btn btn-sm reddit-btn-orange w-100">
                  Crear Publicación
                </Link>
              </div>
            </div>
          </div>

          {/* Caja de Tags */}
          <div className="reddit-card p-3">
            <h6 className="fw-bold mb-3" style={{ fontSize: '12px', color: 'var(--reddit-muted)', textTransform: 'uppercase' }}>Filter by flairs</h6>
            <div className="d-flex flex-wrap gap-1">
              {tags.map(tag => {
                const isSelected = activeTag === tag._id;
                return (
                  <button
                    key={tag._id}
                    onClick={() => {
                      if (isSelected) searchParams.delete('tag');
                      else searchParams.set('tag', tag._id);
                      setSearchParams(searchParams);
                    }}
                    className={`btn btn-sm px-2 py-1 ${isSelected ? 'reddit-btn-orange' : 'reddit-btn-secondary'}`}
                    style={{ fontSize: '12px' }}
                  >
                    #{tag.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* A quién seguir */}
          {user && usuariosSugeridos.length > 0 && (
            <div className="reddit-card p-3 mt-3">
              <h6 className="fw-bold mb-3" style={{ fontSize: '12px', color: 'var(--reddit-muted)', textTransform: 'uppercase' }}>A quién seguir</h6>
              <div className="d-flex flex-column gap-2">
                {usuariosSugeridos.slice(0, 5).map(u => (
                  <div key={u._id} className="d-flex justify-content-between align-items-center">
                    <div className="d-flex flex-column">
                      <span className="small fw-semibold" style={{ color: 'var(--reddit-text)' }}>u/{u.nickName}</span>
                      <span style={{ fontSize: '11px', color: 'var(--reddit-muted)' }}>
                        {u.followers.length} {u.followers.length === 1 ? 'seguidor' : 'seguidores'}
                      </span>
                    </div>
                    <button
                      onClick={() => handleFollowSugerido(u.nickName)}
                      disabled={siguiendoLoading === u.nickName}
                      className="btn btn-sm fw-semibold px-2 py-1"
                      style={{
                        fontSize: '11px',
                        color: '#fff',
                        backgroundColor: siguiendoLoading === u.nickName ? 'var(--reddit-muted)' : 'var(--reddit-orange)',
                        border: 'none',
                        borderRadius: '4px',
                      }}
                    >
                      {siguiendoLoading === u.nickName ? '...' : '+ Seguir'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}