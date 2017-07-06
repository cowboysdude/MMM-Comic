# MMM-Comic
Calvin and Hobbes or Frazz comic strip for MM2.  Changes comic every 30 minutes

  CLONE REPO
  
     cd ~ MagicMirror/modules
     type: git clone https://github.com/cowboysdude/MMM-Comic
     cd ~ MagicMirror/modules/MMM-Comic
     type: npm install
     
## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
{
    module: 'MMM-Comic',
    position: 'bottom_bar',
    config: {
        type: "calvin"
        }
};
]
````

## Configuration options
  
  <table width="100%">
  <thead>
    <tr>
      <th> Option </th>
      <th width="100%"> Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>position</code></td>
      <td> The position of the module.<br><br><b> Example:</b> "middle_center", "lower_third", "bottom_left", "bottom_center", "bottom_right","bottom_bar", "fullscreen_above", "fullscreen_below" </td>
     </tr>
    <tr>
      <td><code>type</code></td>
      <td> The type of comic.<br><br><b> Example:</b> "Cavin" or "frazz" </td>
    </tr>
   </tbody>
  </table>
        
        
  
        
    CHANGES YOU CAN MAKE
      in custom.css you can change width and height of comic like this:
        .MMM-Comic .photo {   
                    height: 30%;         
                    width: 30%;
                          }
                          
       You can change the % values to whatever your comfortable with.  
