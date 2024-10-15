So you've been helping me code the logic for a multi-step form that I'm building. The files we're using for this are: @calculator.js, @formLogic.js, and @radiobutts.js

a couple more things we need to do:

whenever 'f-prev-button' and 'f-next-button' have the combo class 'is-off' added, these buttons' click functionality should be disabled

also, we need to add a new function, or update an existing one, in which:

- once a switch (with id p#-switch) is turned on and if it's corresponding p#-formfields input fields are left unchecked, 
- the 'f-next-button'  should also get the combo class of 'is-off' added. 
- and a new element with the id of 'f-alert' should get the combo class '.is-active' added 

and also

- 'is-off' (for the buttons) and '.is-active' (for the alert) should be removed from both of the previously mentioned elements if:
- user checks all the fields in the p#-formfields (e.g. f-p1 = p1-switch =   p1-formfields) corresponding to the current page and current switch
- user turns off the corresponding switch


