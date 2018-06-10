<?php
if ( ! defined( 'ABSPATH' ) ) {
	die();
}

if ( ! function_exists( 'bootstrap4press_comment_form_fields' ) ) {
	function bootstrap4press_comment_form_fields( $fields ) {
		$commenter = wp_get_current_commenter();
		$req       = get_option( 'require_name_email' );
		$aria_req  = ( $req ? " aria-required='true'" : '' );
		$html5     = current_theme_supports( 'html5', 'comment-form' ) ? 1 : 0;
		$consent   = empty( $commenter['comment_author_email'] ) ? '' : ' checked="checked"';
		$fields    = array(
			'author'  => '<div class="form-group comment-form-author"><label for="author">' . __( 'Name',
					'bootstrap4press' ) . ( $req ? ' <span class="required">*</span>' : '' ) . '</label> ' .
			             '<input class="form-control" id="author" name="author" type="text" value="' . esc_attr( $commenter['comment_author'] ) . '" size="30"' . $aria_req . '><small id="emailHelp" class="form-text text-muted">' . __( 'This name will be displayed in the comment' ) . '</small></div>',
			'email'   => '<div class="form-group comment-form-email"><label for="email">' . __( 'Email',
					'bootstrap4press' ) . ( $req ? ' <span class="required">*</span>' : '' ) . '</label> ' .
			             '<input class="form-control" id="email" name="email" ' . ( $html5 ? 'type="email"' : 'type="text"' ) . ' value="' . esc_attr( $commenter['comment_author_email'] ) . '" size="30"' . $aria_req . '><small id="emailHelp" class="form-text text-muted">' . __( 'We\'ll never share your email with anyone else.' ) . '</small></div>',
			'url'     => '<div class="form-group comment-form-url"><label for="url">' . __( 'Website',
					'bootstrap4press' ) . '</label> ' .
			             '<input class="form-control" id="url" name="url" ' . ( $html5 ? 'type="url"' : 'type="text"' ) . ' value="' . esc_attr( $commenter['comment_author_url'] ) . '" size="30"><small id="emailHelp" class="form-text text-muted">' . __( 'Link to your website' ) . '</small></div>',
			'cookies' => '<div class="form-group form-check comment-form-cookies-consent"><input class="form-check-input" id="wp-comment-cookies-consent" name="wp-comment-cookies-consent" type="checkbox" value="yes"' . $consent . ' /> ' .
			             '<label class="form-check-label" for="wp-comment-cookies-consent">' . __( 'Save my name, email, and website in this browser for the next time I comment.' ) . '</label></div>',
		);

		return $fields;
	}
}
add_filter( 'comment_form_default_fields', 'bootstrap4press_comment_form_fields' );


if ( ! function_exists( 'bootstrap4press_comment_form' ) ) {
	function bootstrap4press_comment_form() {
		$args['comment_field'] = '<div class="form-group comment-form-comment">
	    <label for="comment">' . __( 'Comment:', 'bootstrap4press' ) . ( ' <span class="required">*</span>' ) . '</label>
	    <textarea class="form-control" id="comment" name="comment" aria-required="true" cols="45" rows="8"></textarea>
	    </div>';
		$args['class_submit']  = 'btn btn-secondary'; // since WP 4.1.

		return $args;
	}
}
add_filter( 'comment_form_defaults', 'bootstrap4press_comment_form' );
