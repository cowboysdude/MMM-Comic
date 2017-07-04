# MMM-Comic
Calvin and Hobbes or Frazz comic strip for MM2.  Changes comic every 30 minutes

  CLONE REPO
  
     cd ~ MagicMirror/modules
     type: git clone https://github.com/cowboysdude/MMM-Comic
     cd ~ MagicMirror/modules/MMM-Comic
     type: npm install
     
   CONFIG
       {
            module: 'MMM-Comic',
            position: 'bottom_bar',
            config: {
            type: "calvin"
            }
        }, 
        
        type:  can either be "calvin" or "frazz"
        
        Position anywhere you want.
        
    CHANGES YOU CAN MAKE
      in custom.css you can change width and height of comic like this:
        .MMM-Comic .photo {   
                    height: 30%;         
                    width: 30%;
                          }
                          
       You can change the % values to whatever your comfortable with.  
