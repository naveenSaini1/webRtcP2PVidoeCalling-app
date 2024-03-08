package com.example.demo.controller;

import java.util.Map;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SiglingController {
	 private final SimpMessagingTemplate messagingTemplate;

	 public SiglingController(SimpMessagingTemplate messagingTemplate) {
		 this.messagingTemplate=messagingTemplate;
	 }
	 
	@MessageMapping("/sendInfo")
	public void getTheInfoOfAudio(@Payload Map<Object,Object> object){
		String userName=(String) object.get("userName");
		System.out.println("userName "+userName);
        messagingTemplate.convertAndSend("/topic/"+userName, object);
	}
	
}
