package com.makemytrip.makemytrip.repositories;

import com.makemytrip.makemytrip.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByItemId(String itemId);
    List<Review> findByItemIdAndItemType(String itemId, String itemType);
    List<Review> findByUserId(String userId);
    List<Review> findByItemIdOrderByHelpfulCountDesc(String itemId);
    List<Review> findByFlagged(boolean flagged);
}