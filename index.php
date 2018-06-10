<?php
/**
 * The main template file
 *
 * This is the most generic template file in a WordPress theme
 * and one of the two required files for a theme (the other being style.css).
 * It is used to display a page when nothing more specific matches a query.
 * E.g., it puts together the home page when no home.php file exists.
 *
 * @link https://developer.wordpress.org/themes/basics/template-hierarchy/
 *
 * @package Bootstrap4Press
 */

get_header();
?>
<div class="container">
	<div id="primary" class="content-area row">
		<main id="main" class="site-main col-md-8">
			<!-- test fontawesome -->
			<div class="alert alert-info alert-dismissible fade show" style="font-size: 5rem;">
				<p class="h1"><?php bloginfo( 'description' ); ?></p>
				<i class="fab fa-gulp" style="color: #E44E48;"></i>
				<i class="fas fa-plus" style="color: gray;"></i>
				<i class="fab fa-wordpress" style="color: black"></i>
				<i class="fas fa-plus" style="color: gray;"></i>
				<i class="fab fa-font-awesome-alt" style="color: #2189E6;"></i>
				<i class="fas fa-equals" style="color: gray;"></i>
				<i class="far fa-heart" style="color: red;"></i>
				<button type="button" class="close" data-dismiss="alert" aria-label="Close">
			    <span aria-hidden="true">&times;</span>
			  </button>
			</div>
			<!-- ###test fontawesome -->
			<?php
		if ( have_posts() ) :

			if ( is_home() && ! is_front_page() ) :
				?>
				<header>
					<h1 class="page-title screen-reader-text"><?php single_post_title(); ?></h1>
				</header>
				<?php
			endif;

			/* Start the Loop */
			while ( have_posts() ) :
				the_post();

				/*
				 * Include the Post-Type-specific template for the content.
				 * If you want to override this in a child theme, then include a file
				 * called content-___.php (where ___ is the Post Type name) and that will be used instead.
				 */
				get_template_part( 'template-parts/content', get_post_type() );

			endwhile;

			bootstrap4press_pagination();

		else :

			get_template_part( 'template-parts/content', 'none' );

		endif;
		?>
		</main><!-- #main -->
		<div class="col-md-4">
			<?php get_sidebar(); ?>
		</div>
	</div><!-- #primary -->
</div>
<?php
get_footer();
