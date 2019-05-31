---
layout: page
title: 极客技术专栏
titlebar: geektime
subtitle: <span class="mega-octicon octicon-organization"></span>&nbsp;&nbsp; &nbsp;&nbsp;极客时间大礼包>&nbsp;&nbsp;>&nbsp;&nbsp;<a href ="http://gk.link/a/103Gb" target="_blank" ><font color="#EB9439">点我直达</font></a>
menu: geektime
css: ['blog-page.css']
permalink: /geektime
---

<div class="row">

    <div class="col-md-12">

        <ul id="posts-list">
            {% for post in site.posts %}
                {% if post.category=='geektime' %}
                <li class="posts-list-item">
                    <div class="posts-content">
                        <span class="posts-list-meta">{{ post.date | date: "%Y-%m-%d" }}</span>
                        <a class="posts-list-name bubble-float-left" href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
                        <span class='circle'></span>
                    </div>
                </li>
                {% endif %}
            {% endfor %}
        </ul> 

        <!-- Pagination -->
        {% include pagination.html %}

        <!-- Comments -->
       <div class="comment">
         {% include comments.html %}
       </div>
    </div>

</div>
<script>
    $(document).ready(function(){

        // Enable bootstrap tooltip
        $("body").tooltip({ selector: '[data-toggle=tooltip]' });

    });
</script>