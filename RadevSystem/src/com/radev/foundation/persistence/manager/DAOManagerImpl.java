package com.radev.foundation.persistence.manager;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.radev.foundation.entity.Pedido;

public abstract class DAOManagerImpl<T> implements DAOManager<T> {
	
	private EntityManager em;
	
	@Override
	public void persist(Object entity) throws Exception {
		em = DBEntityManager.getConnection();
		try {			
			em.getTransaction().begin();
			em.persist(entity);
			em.getTransaction().commit();					
		} catch (Exception e) {
			System.out.print(e);
			em.getTransaction().rollback();
			throw new Exception("Falha na tentativa de incluir o registro!", e); 
		} finally {
			em.close();
		}
	}
	
	@Override
	public boolean update(int id) throws Exception {
		em = DBEntityManager.getConnection();
		try {			
			em.getTransaction().begin();
			Query q = em.createQuery("select u from Pedido u where u.pedido_id = :pLogin ");
			q.setParameter("pLogin", id); 
			Pedido p = (Pedido)q.getSingleResult();
			em.getTransaction().commit();
			
			p.setExcluido(1);
			this.persist(p);
			
			return true;
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw new Exception("Falha na tentativa de incluir o registro!", e); 
		}
	}

	@Override
	public void merge(Object entity) throws Exception {
		em = DBEntityManager.getConnection();
		try {			
			em.getTransaction().begin();
			em.merge(entity);
			em.getTransaction().commit();					
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw new Exception("Falha na tentativa de alterar o registro!", e); 
		} finally {
			em.close();
		}
	}
	
	@Override
	public void delete(T entity) throws Exception {
		em = DBEntityManager.getConnection();
		try {			
			em.getTransaction().begin();
			em.remove(entity);
			em.getTransaction().commit();					
		} catch (Exception e) {
			em.getTransaction().rollback();
			throw new Exception("Falha na tentativa de excluir o registro!", e); 
		} finally {
			em.close();
		}
	}

}
