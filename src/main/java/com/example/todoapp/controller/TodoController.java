package com.example.todoapp.controller;

import com.example.todoapp.model.Todo;
import com.example.todoapp.repository.TodoRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000") // Allow requests from React frontend
@RestController
@RequestMapping("/todos") // Base mapping for the controller
public class TodoController {

    private final TodoRepository todoRepository;

    public TodoController(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @GetMapping
    public List<Todo> getAllTodos() {
        return todoRepository.findAll();
    }

    @PostMapping
    public Todo createTodo(@RequestBody Todo todo) {
        return todoRepository.save(todo);
    }

    @DeleteMapping("/{id}") // DELETE mapping
    public ResponseEntity<Void> deleteTodo(@PathVariable String id) {
        todoRepository.deleteById(id);
        return ResponseEntity.noContent().build(); // Return 204 No Content
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable String id, @RequestBody Todo updatedTodo) {
        return todoRepository.findById(id)
                .map(todo -> {
                    todo.setTitle(updatedTodo.getTitle());
                    todo.setDescription(updatedTodo.getDescription());
                    todo.setCompleted(updatedTodo.isCompleted());
                    Todo savedTodo = todoRepository.save(todo);
                    return ResponseEntity.ok(savedTodo);
                })
                .orElse(ResponseEntity.notFound().build());
    }

}
