package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.SearchHistory;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SearchHistoryRepository extends MongoRepository<SearchHistory, String> {
    List<SearchHistory> findByUserIdOrderBySearchDateDesc(String userId);
    List<SearchHistory> findTop10ByUserIdOrderBySearchDateDesc(String userId);
}