package com.gestionnaire.service;

import com.gestionnaire.entity.Notification;
import com.gestionnaire.entity.Task;
import com.gestionnaire.entity.User;
import com.gestionnaire.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    @Transactional
    public Notification createNotification(User user, String message, String type, Task task) {
        Notification notification = new Notification();
        notification.setUser(user);
        notification.setMessage(message);
        notification.setType(type);
        notification.setTask(task);
        notification.setIsRead(false);

        return notificationRepository.save(notification);
    }

    @Transactional
    public void createTaskAssignedNotification(Task task) {
        if (task.getAssignedUsers() != null && !task.getAssignedUsers().isEmpty()) {
            String message = String.format("You have been assigned to task: %s", task.getTitle());
            for (User user : task.getAssignedUsers()) {
                createNotification(user, message, "TASK_ASSIGNED", task);
            }
        }
    }

    @Transactional
    public void createDeadlineNotification(Task task) {
        if (task.getAssignedUsers() != null && !task.getAssignedUsers().isEmpty()) {
            String message = String.format("Task '%s' is approaching its deadline", task.getTitle());
            for (User user : task.getAssignedUsers()) {
                createNotification(user, message, "DEADLINE_APPROACHING", task);
            }
        }
    }

    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notification.setIsRead(true);
        return notificationRepository.save(notification);
    }

    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<Notification> getUnreadNotifications(User user) {
        return notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    public long getUnreadCount(User user) {
        return notificationRepository.countByUserAndIsReadFalse(user);
    }
}
