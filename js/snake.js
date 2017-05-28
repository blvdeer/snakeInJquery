$(document).ready(function(){
    var canvas = $('#canvas')[0];
    var context = canvas.getContext('2d');
    var width = $('#canvas').width();
    var height = $('#canvas').height();
    var cell_width = 10;
    var title = "Snake Game";
    var game_status = "over";
    var game_start;
    var snake_array;
    var snake_food;
    var run;
    var score_text;
    var score;

    function create_stage(){
        //create orange filled rectangle
        context.fillStyle = "orange";
        context.fillRect(0, 0, width, height);

        //add stroke to rectangle
        context.strokeStyle = "#000000";
        context.strokeRect(0, 0, width, height);

        //set text font
        context.font = cell_width + "px Arial";

        //add title in white at the bottom
        context.fillStyle = "#ffffff";
        context.textAlign = "left";
        context.fillText(title, 0, height - cell_width);
    }

    function create_snake(){
        var snake_size = 3;

        //snake will always start at right side in middle
        var snake_x = width / cell_width;
        var snake_y = height / cell_width / 2;
        
        snake_array = [];
        for(var m = 0; m < snake_size; m++){
            snake_array.push({x: snake_x, y: snake_y});
        }
    }

    function snake_body(x, y){
        context.fillStyle = "#ffffff";
        context.fillRect(x * cell_width, y * cell_width, cell_width, cell_width);
        context.strokeStyle = "#000000";
        context.strokeRect(x * cell_width, y * cell_width, cell_width, cell_width);
    }

    function create_food(){
        snake_food = {
            x: Math.round(Math.random() * (width - cell_width) / cell_width),
            y: Math.round(Math.random() * (height - cell_width) / cell_width)
        };
    }

    function show_game_message(){
        context.fillStyle = "#ffffff";
        context.textAlign = "center";

        switch (game_status) {
            case "over":
                game_message = "Game Over";
                break;
            case "paused":
                game_message = "Game Paused";
                break;
            default:
                game_message = "";
                break;
        }

        context.fillText(game_message, width / 2 , height / 2 - cell_width);
        
        var restart_message = "Press any key to begin";
        context.fillText(restart_message, width / 2 , height / 2 + cell_width);
        
        //stop game loop 
        clearInterval(game_start);
    }

    function collision(x, y, array){
        for(var i = 0; i < array.length; i++){
            if(array[i].x == x && array[i].y == y){
                return true;
            }
        }
        return false;
    }

    function config(){
        //get head of snake
        var pop_x = snake_array[0].x;
        var pop_y = snake_array[0].y;

        switch (run) {
            case "right":
                pop_x++;
                break;
            case "left":
                pop_x--;
                break;
            case "up":
                pop_y--;
                break;
            case "down":
                pop_y++;
                break;
        }

        if(pop_x == -1 ||
           pop_x == width/cell_width ||
           pop_y == -1 ||
           pop_y == height/cell_width ||
           collision(pop_x, pop_y, snake_array)){
                game_status = "over";
                show_game_message();
                return;
        }

        //create stage
        create_stage();

        if(pop_x == snake_food.x && pop_y == snake_food.y){
            var snake_tail = {x : pop_x, y : pop_y};
            score += 3;
            create_food();
        } else {
            var snake_tail = snake_array.pop();
            snake_tail.x = pop_x;
            snake_tail.y = pop_y;
        }

        //re-using snake_body to draw snake food
        snake_body(snake_food.x, snake_food.y);

        snake_array.unshift(snake_tail);

        for(var i = 0; i < snake_array.length; i++){
            var c = snake_array[i];
            snake_body(c.x, c.y);
        }

        score_text = "Score : " + score;
        context.textAlign = "left";
        context.fillText(score_text, 0, cell_width);
    }

    $(document).keydown(function(e){
        var key = e.which;
        if(game_status == "running"){
            if(key == "40" && run != "up"){
                run = "down";
            } else if(key == "39" && run != "left"){
                run = "right";
            } else if(key == "38" && run != "down"){
                run = "up";
            } else if(key == "37" && run != "right"){
                run = "left";
            } else if(key == "32"){
                game_status = "paused";
                show_game_message();
            }
        } else {
            start();
        }
    });

    function start(){
        if(game_status == "over"){
            run = "left";
            score = 0;
            create_snake();
            create_food();
        }
        game_status = "running";
        if(typeof game_start == "undefined"){
            clearInterval(game_start);
        }
        game_start = setInterval(config, 60);
    }

    start();
});