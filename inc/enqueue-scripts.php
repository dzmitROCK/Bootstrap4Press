<?php

if(!defined('ABSPATH')) die;

/**
 * Enqueue scripts and styles.
 */
function bootstrap4press_scripts() {

  wp_enqueue_style( 'bootstrap4press-css', get_template_directory_uri() . '/dist/css/app.css' );

	// Deregister the jquery version bundled with WordPress.
	wp_deregister_script( 'jquery' );
	// CDN hosted jQuery placed in the header, as some plugins require that jQuery is loaded in the header.
	wp_enqueue_script( 'jquery', get_template_directory_uri() . '/dist/js/jquery.min.js', array(), '3.3.1', false );
	// Deregister the jquery-migrate version bundled with WordPress.
	wp_deregister_script( 'jquery-migrate' );
	// CDN hosted jQuery migrate for compatibility with jQuery 3.x
	wp_register_script( 'jquery-migrate', '//code.jquery.com/jquery-migrate-3.0.1.min.js', array('jquery'), '3.0.1', false );

	wp_enqueue_script( 'bootstrap4press-js', get_template_directory_uri() . '/dist/js/app.js', array('jquery'), '1.0.0', true );

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action( 'wp_enqueue_scripts', 'bootstrap4press_scripts' );
