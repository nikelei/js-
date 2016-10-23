
    $(document).ready(function(){
      if(localStorage.name){
        $(".login-box,.full-bg").css("display","none");
      }
      $("#sure").on("click",function(){
        localStorage.name = $("#name").val()
        $(".login-box,.full-bg").css("display","none");
        $("#current").text(localStorage.name);
      })
      $("#current").text(localStorage.name);
      $("#reg").on("click",function(){
        $(".login-box,.full-bg").css("display","block");
      })
      $('.emotion').qqFace({
        id : 'facebox', //表情盒子的ID
        assign:'content', //给那个控件赋值
        path:'face/'  //表情存放的路径
      });
    })
    function sendMsg(){
        var name= localStorage.name;
        var content = $("#content").val();
         if($.trim(content)==""){
            alert("内容不能为空！");
            return;
        }       
        var Chat = Bmob.Object.extend("Chat");
        var chat = new Chat();
        chat.set("name", localStorage.name);
        chat.set("content", $("#content").val());
        chat.save(null, {
          success: function(object) {           
          },
          error: function(model, error) {            
          }
        });    
        $("#content").val(""); 
    }
    $("#send").click(function(){
        sendMsg();
    });
    function replace_em(str){
      str = str.replace(/\</g,'&lt;');
      str = str.replace(/\>/g,'&gt;');
      str = str.replace(/\n/g,'<br/>');
      str = str.replace(/\[em_([0-9]*)\]/g,'<img src="face/$1.gif" border="0" />');
      return str;
    }
    //服务器
    BmobSocketIo.initialize("b5858b7b2f1704c0db5d549a2cf48e14");
    Bmob.initialize("b5858b7b2f1704c0db5d549a2cf48e14", "7666c915d7c46a928d547a7898507c4e");
   //初始连接socket.io服务器后，需要监听的事件都写在这个函数内
    BmobSocketIo.onInitListen = function() {
      //订阅GameScore表的数据更新事件
      BmobSocketIo.updateTable("Chat");     
    };
      //监听服务器返回的更新表的数据
   BmobSocketIo.onUpdateTable = function(tablename,data) {    
     if( tablename=="Chat" ) {
        // alert(tablename);
        var content=$("#data");
        if(data.name == localStorage.name){
          var p = '<p class="chat-box-r"><span style="color:red;">' + data.name+'</span>  '+'<span style="color:green;">'+ data.createdAt+'</span>  '+ ' :<br/> '+replace_em(data.content)+'</p><br/><br/>';
        }else{
          var p = '<p class="chat-box-l"><span style="color:red;">' + data.name+'</span>  '+'<span style="color:green;">'+ data.createdAt+'</span>  '+ ' :<br/> '+replace_em(data.content)+'</p><br/><br/>';
        }
        content.html(content.html()+p);
        var top = $("#data")[0].scrollHeight
        $("#data").scrollTop(top);
     }
   };
  //通过“回车”提交聊天信息
   $('#content').keydown(function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      sendMsg();
    }
  });

