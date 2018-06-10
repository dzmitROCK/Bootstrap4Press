<?php

if(!defined('ABSPATH')) die;

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function bootstrap4press_widgets_init() {
	register_sidebar( array(
		'name'          => esc_html__( 'Sidebar', 'bootstrap4press' ),
		'id'            => 'sidebar-1',
		'description'   => esc_html__( 'Add widgets here.', 'bootstrap4press' ),
		'before_widget' => '<section id="%1$s" class="widget %2$s">',
		'after_widget'  => '</section>',
		'before_title'  => '<h2 class="widget-title">',
		'after_title'   => '</h2>',
	) );
}
add_action( 'widgets_init', 'bootstrap4press_widgets_init' );