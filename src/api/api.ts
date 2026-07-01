import type { User, Post, Tag, Comment, PostImage } from '../types';

const API_URL = import.meta.env.VITE_API_URL ;

export const apiService = {
  // ================= LOGIN =================
  loginUser: async (nickName: string, password: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nickName, password }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al iniciar sesión');
    }
    return response.json();
  },

  // ================= USUARIOS =================
  getUsers: async (): Promise<User[]> => {
    const response = await fetch(`${API_URL}/users`);
    if (!response.ok) throw new Error('Error al obtener usuarios');
    return response.json();
  },

  getUserByNickName: async (nickName: string): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${nickName}`);
    if (!response.ok) throw new Error('Usuario no encontrado');
    return response.json();
  },

  createUser: async (userData: Record<string, unknown>): Promise<User> => {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Error al crear el usuario');
    }
    return response.json();
  },

  // ================= POSTEOS =================
  getPosts: async (userId?: string): Promise<Post[]> => {
    const url = userId ? `${API_URL}/posts?userId=${userId}` : `${API_URL}/posts`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al cargar publicaciones');
    return response.json();
  },

  getPostById: async (postId: string): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts/${postId}`);
    if (!response.ok) throw new Error('Publicación no encontrada');
    return response.json();
  },

  createPost: async (postData: { description: string; author: string; tags: string[] }): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Error al crear la publicación');
    }
    return response.json();
  },

  updatePost: async (postId: string, description: string): Promise<Post> => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al editar la publicación');
    }
    return response.json();
  },

  

  deletePost: async (postId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/posts/${postId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar la publicación');
    }
  },

  // ================= ETIQUETAS =================
  getTags: async (): Promise<Tag[]> => {
    const response = await fetch(`${API_URL}/tags`);
    if (!response.ok) throw new Error('Error al cargar etiquetas');
    return response.json();
  },

  createTag: async (name: string): Promise<Tag> => {
    const response = await fetch(`${API_URL}/tags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la etiqueta');
    }
    return response.json();
  },

  updateTag: async (id: string, name: string): Promise<Tag> => {
    const response = await fetch(`${API_URL}/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al editar la etiqueta');
    }
    return response.json();
  },

  deleteTag: async (id: string): Promise<void> => {
    const response = await fetch(`${API_URL}/tags/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al eliminar la etiqueta');
    }
  },

  // ================= COMENTARIOS =================
  getCommentsByPost: async (postId: string): Promise<Comment[]> => {
    const response = await fetch(`${API_URL}/comments/post/${postId}`);
    if (!response.ok) throw new Error('Error al cargar los comentarios');
    return response.json();
  },

  createComment: async (commentData: { postId: string; text: string; author: string }) => {
    const response = await fetch(`${API_URL}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al enviar el comentario');
    }
    return response.json();
  },

  // ================= IMÁGENES =================
  getPostImages: async (postId: string): Promise<PostImage[]> => {
    const response = await fetch(`${API_URL}/postimages/post/${postId}`);
    if (!response.ok) throw new Error('Error al cargar las imágenes');
    return response.json();
  },

  // ================= SEGUIMIENTO =================
  followUser: async (followerNick: string, targetNick: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_URL}/users/follow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ followerNick, targetNick }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Error al seguir al usuario');
    }
    return response.json();
  },

  // Corregido: Ajustado para recibir URL de texto según el alcance de la consigna
  createPostImage: async (postImageData: { url: string; postId: string }): Promise<PostImage> => {
    const response = await fetch(`${API_URL}/postimages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postImageData),
    });
    if (!response.ok) throw new Error('Error al asociar la imagen');
    return response.json();
  }
};