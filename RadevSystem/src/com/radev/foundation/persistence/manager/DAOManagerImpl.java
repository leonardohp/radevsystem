package com.radev.foundation.persistence.manager;

import javax.persistence.EntityManager;

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
			em.getTransaction().rollback();
			throw new Exception("Falha na tentativa de incluir o registro!", e); 
		} finally {
			em.close();
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
