package com.radev.foundation.persistence;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.radev.foundation.entity.Usuario;
import com.radev.foundation.persistence.manager.DAOManagerImpl;
import com.radev.foundation.persistence.manager.DBEntityManager;

public class UsuarioDAO extends DAOManagerImpl<Object> {
	
	private Usuario usuario;
	private EntityManager em = DBEntityManager.getConnection();
	private List<Usuario> usuarios = new ArrayList<Usuario>();
	
	@Override
	public void persist(Object entity) throws Exception, RuntimeException {
		
		usuario = findByLogin(((Usuario)entity).getLogin());
		
		if (usuario == null)
			super.persist(entity);
		else {
			int id = usuario.getId();
			
			usuario = (Usuario)entity;
			usuario.setId(id);
			
			super.merge(usuario);
		}
	}

	public Usuario findByLogin(String login) {
		
		Query q = em.createQuery("select u from Usuario u where u.login = :pLogin ");
		q.setParameter("pLogin", login); 
		
		try {
			return (Usuario)q.getSingleResult();
		} catch (Exception e) {
			return null;
		}
		
	}
	
	@SuppressWarnings("unchecked")
	public List<Usuario> listAll() {
		
		try {
			Query query = em.createQuery("select u from Usuario u");
			this.usuarios = Collections.checkedList(query.getResultList(), Usuario.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		return this.usuarios;
		
	}
	
}
